package com.example.mini_dmart.dto;

import com.example.mini_dmart.model.OrderType;
import com.example.mini_dmart.model.RequestType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

public class CartItemRequest {

    @Data
    public static class Add {
        @NotNull
        private Long productId;

        @NotNull
        @Min(1)
        private Integer quantity;
    }

    @Data
    public static class Update {
        @NotNull
        @Min(1)
        private Integer quantity;
    }
}
