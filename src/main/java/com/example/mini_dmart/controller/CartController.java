package com.example.mini_dmart.controller;

import com.example.mini_dmart.dto.CartItemRequest;
import com.example.mini_dmart.model.CartItem;
import com.example.mini_dmart.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart() {
        return ResponseEntity.ok(cartService.getCart());
    }

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@Valid @RequestBody CartItemRequest.Add request) {
        return ResponseEntity.ok(cartService.addToCart(request.getProductId(), request.getQuantity()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartItem> updateCartItem(
            @PathVariable Long id,
            @Valid @RequestBody CartItemRequest.Update request) {
        return ResponseEntity.ok(cartService.updateCartItem(id, request.getQuantity()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeCartItem(@PathVariable Long id) {
        cartService.removeCartItem(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart() {
        cartService.clearCart();
        return ResponseEntity.noContent().build();
    }
}
