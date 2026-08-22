package com.example.mini_dmart.service;

import com.example.mini_dmart.model.Category;
import com.example.mini_dmart.model.Product;
import com.example.mini_dmart.repository.CategoryRepository;
import com.example.mini_dmart.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final AuditService auditService;

    public List<Product> getAllProducts(Long categoryId, String search) {
        if (categoryId != null || (search != null && !search.trim().isEmpty())) {
            return productRepository.searchProducts(categoryId, search != null ? search.trim() : null);
        }
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<Product> getLowStockProducts() {
        return productRepository.findLowStockProducts();
    }

    @Transactional
    public Product createProduct(Product product) {
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            Category category = categoryRepository.findById(product.getCategory().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid category ID: " + product.getCategory().getId()));
            product.setCategory(category);
        }
        if (productRepository.findBySku(product.getSku()).isPresent()) {
            throw new IllegalArgumentException("Product SKU already exists: " + product.getSku());
        }
        Product saved = productRepository.save(product);
        auditService.logAction("CREATE_PRODUCT", "Product", saved.getId().toString(), "Created product: " + saved.getName());
        return saved;
    }

    @Transactional
    public Product updateProduct(Long id, Product details) {
        Product existing = getProductById(id);
        existing.setName(details.getName());
        existing.setDescription(details.getDescription());
        existing.setPrice(details.getPrice());
        existing.setOriginalPrice(details.getOriginalPrice());
        existing.setUnit(details.getUnit());
        existing.setImageUrl(details.getImageUrl());
        existing.setStockQuantity(details.getStockQuantity());
        existing.setLowStockThreshold(details.getLowStockThreshold());
        existing.setIsAvailable(details.getIsAvailable());
        
        if (details.getCategory() != null && details.getCategory().getId() != null) {
            Category category = categoryRepository.findById(details.getCategory().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid category ID: " + details.getCategory().getId()));
            existing.setCategory(category);
        }

        Product updated = productRepository.save(existing);
        auditService.logAction("UPDATE_PRODUCT", "Product", updated.getId().toString(), "Updated product details & stock: " + updated.getStockQuantity());
        return updated;
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
        auditService.logAction("DELETE_PRODUCT", "Product", id.toString(), "Deleted product: " + product.getName());
    }
}
