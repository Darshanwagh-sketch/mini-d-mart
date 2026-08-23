package com.example.mini_dmart.service;

import com.example.mini_dmart.dto.OrderRequest;
import com.example.mini_dmart.model.*;
import com.example.mini_dmart.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final StoreLocationRepository storeLocationRepository;
    private final AuthService authService;
    private final AuditService auditService;

    @Transactional
    public Order placeOrder(OrderRequest request) {
        User user = authService.getCurrentUser();
        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());

        if (cartItems.isEmpty()) {
            throw new IllegalStateException("Your cart is empty!");
        }

        // Validate stock
        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        Order order = Order.builder()
                .orderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .user(user)
                .orderType(request.getOrderType())
                .status(OrderStatus.PLACED)
                .deliveryAddress(request.getDeliveryAddress())
                .deliveryTimeSlot(request.getDeliveryTimeSlot())
                .notes(request.getNotes())
                .build();

        if (request.getOrderType() == OrderType.HOME_DELIVERY) {
            if (request.getDeliveryAddress() == null || request.getDeliveryAddress().trim().length() < 5) {
                throw new IllegalArgumentException("Delivery address is required for Home Delivery orders! Please provide a complete delivery address.");
            }
            order.setTrackingNumber("TRK-DMART-" + generatePickupCode());
            order.setDeliveryPartner("D-Mart Express Rider");
            order.setDeliveryRiderName("Ramesh Kumar (Express Delivery)");
            order.setDeliveryRiderPhone("+91 98201 55443");
            order.setEstimatedDeliveryTime("25-35 Mins");
            order.setCurrentLatitude(19.1176);
            order.setCurrentLongitude(72.9060);
        } else if (request.getOrderType() == OrderType.STORE_PICKUP) {

            if (request.getStoreLocationId() == null) {
                throw new IllegalArgumentException("Store location required for store pickup");
            }
            StoreLocation store = storeLocationRepository.findById(request.getStoreLocationId())
                    .orElseThrow(() -> new RuntimeException("Store location not found"));
            order.setStoreLocation(store);
            order.setPickupCode("PK-" + generatePickupCode());
        }


        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new IllegalArgumentException("Product " + product.getName() + " has insufficient stock (" + product.getStockQuantity() + " available)");
            }

            // Decrement Stock
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            subtotal = subtotal.add(lineTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .unitPrice(product.getPrice())
                    .totalPrice(lineTotal)
                    .build();

            orderItems.add(orderItem);
        }

        order.setItems(orderItems);
        order.setSubtotalAmount(subtotal);

        // Taxes & Delivery Fee Calculation
        BigDecimal tax = subtotal.multiply(new BigDecimal("0.05")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal deliveryFee = BigDecimal.ZERO;
        if (request.getOrderType() == OrderType.HOME_DELIVERY) {
            deliveryFee = subtotal.compareTo(new BigDecimal("500")) >= 0 ? BigDecimal.ZERO : new BigDecimal("49.00");
        }

        order.setTaxAmount(tax);
        order.setDeliveryFee(deliveryFee);
        order.setTotalAmount(subtotal.add(tax).add(deliveryFee));

        Order savedOrder = orderRepository.save(order);

        // Clear cart
        cartItemRepository.deleteByUserId(user.getId());

        auditService.logAction("PLACE_ORDER", "Order", savedOrder.getId().toString(), 
                "Placed order " + savedOrder.getOrderNumber() + " Total: ₹" + savedOrder.getTotalAmount());

        return savedOrder;
    }

    public List<Order> getMyOrders() {
        User user = authService.getCurrentUser();
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public Order getOrderById(Long id) {
        User user = authService.getCurrentUser();
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        // Security check: Customers can only see their own orders unless Staff/Admin
        if (user.getRole() == Role.ROLE_CUSTOMER && !order.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Access denied to this order");
        }
        return order;
    }

    public Order getOrderByPickupCode(String pickupCode) {
        return orderRepository.findByPickupCode(pickupCode.trim().toUpperCase())
                .orElseThrow(() -> new RuntimeException("No pickup order found for code: " + pickupCode));
    }

    public List<Order> getAllOrders(OrderStatus status) {
        if (status != null) {
            return orderRepository.findByStatusOrderByCreatedAtDesc(status);
        }
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Order cancelOrder(Long id) {
        User user = authService.getCurrentUser();
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (user.getRole() == Role.ROLE_CUSTOMER && !order.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized cancellation request");
        }

        if (order.getStatus() != OrderStatus.PLACED) {
            throw new IllegalStateException("Order cannot be cancelled once preparation has started. Current status: " + order.getStatus());
        }

        order.setStatus(OrderStatus.CANCELLED);

        // Restock items
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
        }

        Order cancelledOrder = orderRepository.save(order);
        auditService.logAction("CANCEL_ORDER", "Order", cancelledOrder.getId().toString(), "Cancelled order " + order.getOrderNumber() + " and restocked inventory");
        return cancelledOrder;
    }

    @Transactional
    public Order updateOrderStatus(Long id, OrderStatus newStatus, String notes) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(newStatus);
        if (notes != null && !notes.trim().isEmpty()) {
            order.setNotes(notes);
        }

        if (order.getOrderType() == OrderType.HOME_DELIVERY) {
            if (order.getTrackingNumber() == null || order.getTrackingNumber().isBlank()) {
                order.setTrackingNumber("TRK-DMART-" + generatePickupCode());
            }
            if (order.getDeliveryPartner() == null) {
                order.setDeliveryPartner("D-Mart Express Rider");
            }
            if (order.getDeliveryRiderName() == null) {
                order.setDeliveryRiderName("Ramesh Kumar (Express Delivery)");
                order.setDeliveryRiderPhone("+91 98201 55443");
            }
            if (newStatus == OrderStatus.OUT_FOR_DELIVERY) {
                order.setEstimatedDeliveryTime("15-25 Mins (Rider En Route)");
            } else if (newStatus == OrderStatus.DELIVERED) {
                order.setEstimatedDeliveryTime("Delivered");
            }
        }

        Order updatedOrder = orderRepository.save(order);
        auditService.logAction("UPDATE_ORDER_STATUS", "Order", updatedOrder.getId().toString(), 
                "Updated status of order " + order.getOrderNumber() + " to " + newStatus);
        return updatedOrder;
    }


    private String generatePickupCode() {
        SecureRandom random = new SecureRandom();
        int num = 100000 + random.nextInt(900000);
        return String.valueOf(num);
    }
}
