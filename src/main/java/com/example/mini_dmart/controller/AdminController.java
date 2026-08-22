package com.example.mini_dmart.controller;

import com.example.mini_dmart.dto.DashboardStatsDto;
import com.example.mini_dmart.model.*;
import com.example.mini_dmart.repository.OrderRepository;
import com.example.mini_dmart.repository.ReturnExchangeRequestRepository;
import com.example.mini_dmart.repository.UserRepository;
import com.example.mini_dmart.service.AuditService;
import com.example.mini_dmart.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProductService productService;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ReturnExchangeRequestRepository returnRepository;
    private final AuditService auditService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        List<Order> orders = orderRepository.findAll();
        BigDecimal totalRevenue = orders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long lowStockCount = productService.getLowStockProducts().size();
        long pendingReturnsCount = returnRepository.findByStatusOrderByRequestedAtDesc(RequestStatus.PENDING).size();
        long customerCount = userRepository.findByRole(Role.ROLE_CUSTOMER).size();

        DashboardStatsDto stats = DashboardStatsDto.builder()
                .totalRevenue(totalRevenue)
                .totalOrders((long) orders.size())
                .totalCustomers(customerCount)
                .lowStockCount(lowStockCount)
                .pendingReturnsCount(pendingReturnsCount)
                .build();

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Role newRole = Role.valueOf(body.get("role"));
        user.setRole(newRole);
        User updated = userRepository.save(user);
        auditService.logAction("UPDATE_USER_ROLE", "User", user.getId().toString(), "Updated role of " + user.getEmail() + " to " + newRole);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.createProduct(product));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/products/low-stock")
    public ResponseEntity<List<Product>> getLowStockProducts() {
        return ResponseEntity.ok(productService.getLowStockProducts());
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditService.getAllAuditLogs());
    }
}
