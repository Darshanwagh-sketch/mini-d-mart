package com.example.mini_dmart.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank
    @Column(unique = true, nullable = false)
    private String sku;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @NotNull
    @Min(0)
    @Column(nullable = false)
    private BigDecimal price;

    private BigDecimal originalPrice;

    private String unit; // e.g. "1 kg", "500 g", "1 L", "Pack of 6"

    private String imageUrl;

    @NotNull
    @Min(0)
    @Column(nullable = false)
    private Integer stockQuantity;

    @Builder.Default
    private Integer lowStockThreshold = 5;

    @Builder.Default
    private Boolean isAvailable = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
