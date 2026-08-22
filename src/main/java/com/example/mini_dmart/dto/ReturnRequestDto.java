package com.example.mini_dmart.dto;

import com.example.mini_dmart.model.RequestType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReturnRequestDto {
    @NotNull
    private Long orderId;

    @NotNull
    private Long orderItemId;

    @NotNull
    private RequestType requestType; // RETURN or EXCHANGE

    @NotNull
    @Min(1)
    private Integer quantity;

    @NotBlank
    private String reason;
}
