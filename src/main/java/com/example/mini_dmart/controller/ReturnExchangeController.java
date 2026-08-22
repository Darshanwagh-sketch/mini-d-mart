package com.example.mini_dmart.controller;

import com.example.mini_dmart.dto.ReturnRequestDto;
import com.example.mini_dmart.model.ReturnExchangeRequest;
import com.example.mini_dmart.service.ReturnExchangeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/returns")
@RequiredArgsConstructor
public class ReturnExchangeController {

    private final ReturnExchangeService returnService;

    @PostMapping
    public ResponseEntity<ReturnExchangeRequest> createRequest(@Valid @RequestBody ReturnRequestDto dto) {
        return ResponseEntity.ok(returnService.createRequest(dto));
    }

    @GetMapping("/my-requests")
    public ResponseEntity<List<ReturnExchangeRequest>> getMyRequests() {
        return ResponseEntity.ok(returnService.getMyRequests());
    }
}
