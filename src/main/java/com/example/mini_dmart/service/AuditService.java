package com.example.mini_dmart.service;

import com.example.mini_dmart.model.AuditLog;
import com.example.mini_dmart.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public void logAction(String action, String entityName, String entityId, String details) {
        String userEmail = "SYSTEM";
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
            userEmail = authentication.getName();
        }

        AuditLog log = AuditLog.builder()
                .userEmail(userEmail)
                .action(action)
                .entityName(entityName)
                .entityId(entityId)
                .details(details)
                .build();

        auditLogRepository.save(log);
    }

    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }
}
