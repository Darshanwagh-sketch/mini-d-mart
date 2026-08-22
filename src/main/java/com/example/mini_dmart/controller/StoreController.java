package com.example.mini_dmart.controller;

import com.example.mini_dmart.model.StoreLocation;
import com.example.mini_dmart.repository.StoreLocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreLocationRepository storeLocationRepository;

    @GetMapping
    public ResponseEntity<List<StoreLocation>> getActiveStores() {
        return ResponseEntity.ok(storeLocationRepository.findByActiveTrue());
    }
}
