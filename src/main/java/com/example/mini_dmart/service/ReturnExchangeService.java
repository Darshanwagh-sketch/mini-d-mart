package com.example.mini_dmart.service;

import com.example.mini_dmart.dto.ReturnRequestDto;
import com.example.mini_dmart.model.*;
import com.example.mini_dmart.repository.OrderItemRepository;
import com.example.mini_dmart.repository.OrderRepository;
import com.example.mini_dmart.repository.ProductRepository;
import com.example.mini_dmart.repository.ReturnExchangeRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReturnExchangeService {

    private final ReturnExchangeRequestRepository returnRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final AuthService authService;
    private final AuditService auditService;

    @Transactional
    public ReturnExchangeRequest createRequest(ReturnRequestDto dto) {
        User user = authService.getCurrentUser();
        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized request for this order");
        }

        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new IllegalStateException("Return/Exchange can only be requested for DELIVERED orders");
        }

        // Eligibility check: Within 7 days of creation
        if (order.getCreatedAt().plusDays(7).isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Return period expired. Requests must be submitted within 7 days of delivery");
        }

        OrderItem item = orderItemRepository.findById(dto.getOrderItemId())
                .orElseThrow(() -> new RuntimeException("Order item not found"));

        if (dto.getQuantity() > item.getQuantity()) {
            throw new IllegalArgumentException("Requested quantity exceeds ordered item quantity");
        }

        ReturnExchangeRequest request = ReturnExchangeRequest.builder()
                .requestNumber("REQ-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .order(order)
                .item(item)
                .requestType(dto.getRequestType())
                .quantity(dto.getQuantity())
                .reason(dto.getReason())
                .status(RequestStatus.PENDING)
                .build();

        ReturnExchangeRequest saved = returnRepository.save(request);
        auditService.logAction("CREATE_RETURN_REQUEST", "ReturnExchangeRequest", saved.getId().toString(), 
                "Created " + saved.getRequestType() + " request " + saved.getRequestNumber());
        return saved;
    }

    public List<ReturnExchangeRequest> getMyRequests() {
        User user = authService.getCurrentUser();
        return returnRepository.findByOrderUserIdOrderByRequestedAtDesc(user.getId());
    }

    public List<ReturnExchangeRequest> getAllRequests(RequestStatus status) {
        if (status != null) {
            return returnRepository.findByStatusOrderByRequestedAtDesc(status);
        }
        return returnRepository.findAllByOrderByRequestedAtDesc();
    }

    @Transactional
    public ReturnExchangeRequest processRequest(Long requestId, RequestStatus newStatus, String adminNotes) {
        ReturnExchangeRequest request = returnRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus(newStatus);
        request.setAdminNotes(adminNotes);
        request.setProcessedAt(LocalDateTime.now());

        // If approved or processed, restock inventory
        if (newStatus == RequestStatus.APPROVED || newStatus == RequestStatus.PROCESSED) {
            Product product = request.getItem().getProduct();
            product.setStockQuantity(product.getStockQuantity() + request.getQuantity());
            productRepository.save(product);
        }

        ReturnExchangeRequest updated = returnRepository.save(request);
        auditService.logAction("PROCESS_RETURN_REQUEST", "ReturnExchangeRequest", updated.getId().toString(), 
                "Processed " + request.getRequestNumber() + " to status " + newStatus);
        return updated;
    }
}
