package com.example.mini_dmart.repository;

import com.example.mini_dmart.model.StoreLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreLocationRepository extends JpaRepository<StoreLocation, Long> {
    List<StoreLocation> findByActiveTrue();
}
