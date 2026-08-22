# Security & Compliance Policy — Mini D-Mart

This document outlines the security architecture, threat mitigations, and compliance standards implemented across the **Mini D-Mart Grocery Store Application**.

---

## 🔒 1. Authentication & Token Management

- **JSON Web Tokens (JWT)**: Authentication is stateless using standard Bearer JWT tokens signed with a 256-bit HMAC secret key (`HS256`). Tokens have a default expiration of 24 hours (`86,400,000 ms`).
- **Token Extraction Filter**: `JwtAuthFilter` intercepts incoming HTTP requests, extracts the Authorization Bearer header, validates the signature, parses claims, and hydrates Spring Security's `SecurityContextHolder`.
- **CORS Protection**: Configured via `CorsConfigurationSource` restricting allowed HTTP methods (`GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`) and validating authorization headers.

---

## 🛡️ 2. Role-Based Access Control (RBAC)

The system enforces strict role-based authorization at the Security Filter Chain level:

| Endpoint Pattern | Allowed Roles / Access | Description |
|---|---|---|
| `/api/auth/**` | `PermitAll` | Public login & registration endpoints |
| `GET /api/products/**` | `PermitAll` | Public browsing of products & categories |
| `GET /api/stores/**` | `PermitAll` | Public store location branch view |
| `/api/cart/**` | `ROLE_CUSTOMER`, `ROLE_STAFF`, `ROLE_ADMIN` | Authenticated user cart operations |
| `/api/orders/**` | `ROLE_CUSTOMER`, `ROLE_STAFF`, `ROLE_ADMIN` | Order creation & history |
| `/api/returns/**` | `ROLE_CUSTOMER`, `ROLE_STAFF`, `ROLE_ADMIN` | Customer return/exchange requests |
| `/api/staff/**` | `ROLE_STAFF`, `ROLE_ADMIN` | Store operations queue, pickup code verification, return processing |
| `/api/admin/**` | `ROLE_ADMIN` | Executive dashboard, inventory management, role updates, audit logs |

---

## 🔑 3. Password Security & Hashing

- **BCrypt Hashing**: All user passwords are encrypted using `BCryptPasswordEncoder` before database persistence. Raw passwords are never logged, stored in plain text, or exposed in API response payloads.
- **UserDetails Security**: `UserDetailsImpl` excludes password fields from JSON serialization using `@JsonIgnore`.

---

## 📦 4. Inventory Stock Race Condition & Transactional Safety

- **Atomic Stock Checks**: `OrderService.placeOrder()` is annotated with `@Transactional`. Before decrements occur, item stock quantities are verified against requested quantities.
- **Automated Inventory Restocking**:
  - Customer order cancellation before preparation automatically increments stock quantities back into available inventory.
  - Staff/Admin approval of a Return/Exchange request triggers automated stock restocking in a single database transaction.

---

## 📝 5. Audit Logging & System Oversight

- **Centralized Audit Service**: Sensitivity-critical operations (User Registration, User Login, Order Placement, Order Cancellations, Status Updates, Product Stock Adjustments, User Role Changes, Return Approvals) are written to `audit_logs` table with timestamp, operator email, action name, target entity ID, and context details.
- **Audit Viewer**: Dedicated tab in Admin Console for complete security transparency.

---

## ⚠️ 6. Input Validation & Error Handling

- **JSR-308 / Hibernate Validator**: Request DTOs are validated using `@NotNull`, `@NotBlank`, `@Min`, `@Email` annotations.
- **Clean Exception Propagation**: Domain violations (e.g. insufficient stock, invalid pickup code, expired return period) return clear error messages without exposing raw database stack traces.
