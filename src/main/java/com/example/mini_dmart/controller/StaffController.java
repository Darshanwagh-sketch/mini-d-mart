package com.example.mini_dmart.controller;

import com.example.mini_dmart.dto.StatusUpdateRequest;
import com.example.mini_dmart.model.*;
import com.example.mini_dmart.service.OrderService;
import com.example.mini_dmart.service.ReturnExchangeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {

    private final OrderService orderService;
    private final ReturnExchangeService returnService;

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getOrderQueue(@RequestParam(required = false) OrderStatus status) {
        return ResponseEntity.ok(orderService.getAllOrders(status));
    }

    @GetMapping("/orders/pickup/{pickupCode}")
    public ResponseEntity<Order> getOrderByPickupCode(@PathVariable String pickupCode) {
        return ResponseEntity.ok(orderService.getOrderByPickupCode(pickupCode));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest.OrderStatusUpdate request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request.getStatus(), request.getNotes()));
    }

    @GetMapping("/returns")
    public ResponseEntity<List<ReturnExchangeRequest>> getReturnQueue(@RequestParam(required = false) RequestStatus status) {
        return ResponseEntity.ok(returnService.getAllRequests(status));
    }

    @PutMapping("/returns/{id}/process")
    public ResponseEntity<ReturnExchangeRequest> processReturn(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest.ReturnStatusUpdate request) {
        return ResponseEntity.ok(returnService.processRequest(id, request.getStatus(), request.getAdminNotes()));
    }
}
