package com.example.mini_dmart.dto;

import com.example.mini_dmart.model.OrderStatus;
import com.example.mini_dmart.model.RequestStatus;
import lombok.Data;

public class StatusUpdateRequest {

    @Data
    public static class OrderStatusUpdate {
        private OrderStatus status;
        private String notes;
    }

    @Data
    public static class ReturnStatusUpdate {
        private RequestStatus status;
        private String adminNotes;
    }
}
