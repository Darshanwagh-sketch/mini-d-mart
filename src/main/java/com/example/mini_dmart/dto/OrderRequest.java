package com.example.mini_dmart.dto;

import com.example.mini_dmart.model.OrderType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderRequest {
    @NotNull
    private OrderType orderType; // HOME_DELIVERY or STORE_PICKUP

    private Long storeLocationId;
    private String deliveryAddress;
    private String deliveryTimeSlot;
    private String notes;
}
