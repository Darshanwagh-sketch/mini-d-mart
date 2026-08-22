package com.example.mini_dmart.repository;

import com.example.mini_dmart.model.RequestStatus;
import com.example.mini_dmart.model.ReturnExchangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReturnExchangeRequestRepository extends JpaRepository<ReturnExchangeRequest, Long> {
    List<ReturnExchangeRequest> findByOrderUserIdOrderByRequestedAtDesc(Long userId);
    List<ReturnExchangeRequest> findByStatusOrderByRequestedAtDesc(RequestStatus status);
    List<ReturnExchangeRequest> findAllByOrderByRequestedAtDesc();
}
