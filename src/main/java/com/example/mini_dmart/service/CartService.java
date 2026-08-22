package com.example.mini_dmart.service;

import com.example.mini_dmart.model.CartItem;
import com.example.mini_dmart.model.Product;
import com.example.mini_dmart.model.User;
import com.example.mini_dmart.repository.CartItemRepository;
import com.example.mini_dmart.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final AuthService authService;

    public List<CartItem> getCart() {
        User user = authService.getCurrentUser();
        return cartItemRepository.findByUserId(user.getId());
    }

    @Transactional
    public CartItem addToCart(Long productId, Integer quantity) {
        User user = authService.getCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        if (!product.getIsAvailable() || product.getStockQuantity() < quantity) {
            throw new IllegalArgumentException("Insufficient stock available for " + product.getName());
        }

        Optional<CartItem> existingOpt = cartItemRepository.findByUserIdAndProductId(user.getId(), productId);
        if (existingOpt.isPresent()) {
            CartItem existing = existingOpt.get();
            int newQty = existing.getQuantity() + quantity;
            if (product.getStockQuantity() < newQty) {
                throw new IllegalArgumentException("Cannot add more. Stock limit reached (" + product.getStockQuantity() + ")");
            }
            existing.setQuantity(newQty);
            return cartItemRepository.save(existing);
        } else {
            CartItem newItem = CartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(quantity)
                    .build();
            return cartItemRepository.save(newItem);
        }
    }

    @Transactional
    public CartItem updateCartItem(Long cartItemId, Integer quantity) {
        User user = authService.getCurrentUser();
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized cart access");
        }

        if (cartItem.getProduct().getStockQuantity() < quantity) {
            throw new IllegalArgumentException("Requested quantity exceeds available stock (" + cartItem.getProduct().getStockQuantity() + ")");
        }

        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }

    @Transactional
    public void removeCartItem(Long cartItemId) {
        User user = authService.getCurrentUser();
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized cart access");
        }

        cartItemRepository.delete(cartItem);
    }

    @Transactional
    public void clearCart() {
        User user = authService.getCurrentUser();
        cartItemRepository.deleteByUserId(user.getId());
    }
}
