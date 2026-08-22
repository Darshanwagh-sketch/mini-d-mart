package com.example.mini_dmart.service;

import com.example.mini_dmart.model.*;
import com.example.mini_dmart.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final StoreLocationRepository storeLocationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        if (storeLocationRepository.count() == 0) {
            seedStores();
        }
        seedUsers();
        if (categoryRepository.count() == 0) {
            seedCatalog();
        }
    }

    private void seedStores() {
        StoreLocation store1 = StoreLocation.builder()
                .name("D-Mart Express - Powai Central")
                .address("Hiranandani Business Park, Powai, Mumbai")
                .operatingHours("8:00 AM - 10:00 PM")
                .contactPhone("+91 98200 11223")
                .active(true)
                .build();

        StoreLocation store2 = StoreLocation.builder()
                .name("D-Mart Supercenter - Andheri East")
                .address("MIDC Central Road, Andheri East, Mumbai")
                .operatingHours("8:00 AM - 10:00 PM")
                .contactPhone("+91 98200 44556")
                .active(true)
                .build();

        StoreLocation store3 = StoreLocation.builder()
                .name("D-Mart Hypermarket - Thane West")
                .address("Ghodbunder Road, Majiwada, Thane West")
                .operatingHours("8:00 AM - 10:00 PM")
                .contactPhone("+91 98200 77889")
                .active(true)
                .build();

        storeLocationRepository.saveAll(List.of(store1, store2, store3));
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@minidmart.com")) {
            User admin = User.builder()
                    .email("admin@minidmart.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .fullName("Rajesh Sharma (Admin)")
                    .role(Role.ROLE_ADMIN)
                    .phone("+91 98190 00001")
                    .address("Powai Central HQ, Mumbai")
                    .build();
            userRepository.save(admin);
        }

        if (!userRepository.existsByEmail("staff@minidmart.com")) {
            User staff = User.builder()
                    .email("staff@minidmart.com")
                    .password(passwordEncoder.encode("Staff@123"))
                    .fullName("Priya Patel (Staff)")
                    .role(Role.ROLE_STAFF)
                    .phone("+91 98190 00002")
                    .address("Powai Store Fulfillment Unit")
                    .build();
            userRepository.save(staff);
        }

        if (!userRepository.existsByEmail("customer@minidmart.com")) {
            User customer = User.builder()
                    .email("customer@minidmart.com")
                    .password(passwordEncoder.encode("Customer@123"))
                    .fullName("Darshan Kumar (Customer)")
                    .role(Role.ROLE_CUSTOMER)
                    .phone("+91 98190 00003")
                    .address("Flat 402, Green Acres Apt, Powai, Mumbai")
                    .build();
            userRepository.save(customer);
        }
    }


    private void seedCatalog() {
        // Categories
        Category fv = Category.builder()
                .name("Fruits & Vegetables")
                .slug("fruits-vegetables")
                .description("Fresh farm-picked fruits, leafy vegetables & organic produce")
                .imageUrl("https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80")
                .build();

        Category db = Category.builder()
                .name("Dairy & Bakery")
                .slug("dairy-bakery")
                .description("Fresh milk, butter, cheese, artisan breads & baked delights")
                .imageUrl("https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80")
                .build();

        Category bev = Category.builder()
                .name("Beverages & Juices")
                .slug("beverages")
                .description("Refreshing juices, gourmet teas, roasted coffee & sparkling drinks")
                .imageUrl("https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80")
                .build();

        Category snacks = Category.builder()
                .name("Snacks & Staples")
                .slug("snacks-staples")
                .description("Premium basmati rice, organic pulses, healthy snacks & chocolates")
                .imageUrl("https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=600&q=80")
                .build();

        Category household = Category.builder()
                .name("Household & Cleaning")
                .slug("household")
                .description("Essential cleaning supplies, detergents & home care products")
                .imageUrl("https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80")
                .build();

        Category personal = Category.builder()
                .name("Personal Care")
                .slug("personal-care")
                .description("Skin care, hair care, oral care & premium grooming essentials")
                .imageUrl("https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80")
                .build();

        categoryRepository.saveAll(List.of(fv, db, bev, snacks, household, personal));

        // Products
        Product[] products = {
            // 1. FRUITS & VEGETABLES
            Product.builder()
                    .name("Fresh Alphonso Mangoes (Devgad)")
                    .sku("FV-MNG-001")
                    .category(fv)
                    .price(new BigDecimal("599.00"))
                    .originalPrice(new BigDecimal("799.00"))
                    .unit("1 Dozen (12 Pcs)")
                    .description("Handpicked authentic Devgad Alphonso mangoes, rich aroma & naturally sweet.")
                    .imageUrl("https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(45).lowStockThreshold(10).isAvailable(true).build(),

            Product.builder()
                    .name("Organic Farm Bananas (Yelakki)")
                    .sku("FV-BAN-002")
                    .category(fv)
                    .price(new BigDecimal("65.00"))
                    .originalPrice(new BigDecimal("80.00"))
                    .unit("1 kg")
                    .description("Naturally ripened Yelakki bananas packed with potassium and energy.")
                    .imageUrl("https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(120).lowStockThreshold(15).isAvailable(true).build(),

            Product.builder()
                    .name("Fresh Farm Red Tomatoes")
                    .sku("FV-TOM-003")
                    .category(fv)
                    .price(new BigDecimal("38.00"))
                    .originalPrice(new BigDecimal("50.00"))
                    .unit("1 kg")
                    .description("Firm, juicy red vine tomatoes direct from local farms.")
                    .imageUrl("https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(85).lowStockThreshold(12).isAvailable(true).build(),

            Product.builder()
                    .name("Crisp Exotic Broccoli")
                    .sku("FV-BRO-004")
                    .category(fv)
                    .price(new BigDecimal("89.00"))
                    .originalPrice(new BigDecimal("120.00"))
                    .unit("500 g")
                    .description("Fresh green nutrient-rich broccoli florets.")
                    .imageUrl("https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(14).lowStockThreshold(5).isAvailable(true).build(),

            Product.builder()
                    .name("Fresh Nashik Red Onions")
                    .sku("FV-ONN-005")
                    .category(fv)
                    .price(new BigDecimal("45.00"))
                    .originalPrice(new BigDecimal("60.00"))
                    .unit("1 kg Bag")
                    .description("Farm-fresh crisp Nashik red onions, rich flavor for daily cooking.")
                    .imageUrl("https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(150).lowStockThreshold(20).isAvailable(true).build(),

            Product.builder()
                    .name("Organic Farm Potatoes (Aloo)")
                    .sku("FV-POT-006")
                    .category(fv)
                    .price(new BigDecimal("35.00"))
                    .originalPrice(new BigDecimal("45.00"))
                    .unit("1 kg Bag")
                    .description("Naturally grown dirt-clean potatoes, high starch & perfect texture.")
                    .imageUrl("https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(180).lowStockThreshold(25).isAvailable(true).build(),

            Product.builder()
                    .name("Fresh Crunchy Orange Carrots")
                    .sku("FV-CRT-007")
                    .category(fv)
                    .price(new BigDecimal("48.00"))
                    .originalPrice(new BigDecimal("60.00"))
                    .unit("500 g Pack")
                    .description("Sweet, crisp orange carrots packed with Beta-Carotene & Vitamin A.")
                    .imageUrl("https://images.unsplash.com/photo-1598170845058-12ef4a457939?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(75).lowStockThreshold(10).isAvailable(true).build(),

            Product.builder()
                    .name("Fresh Green Capsicum (Bell Pepper)")
                    .sku("FV-CAP-008")
                    .category(fv)
                    .price(new BigDecimal("55.00"))
                    .originalPrice(new BigDecimal("70.00"))
                    .unit("500 g Pack")
                    .description("Glossy green bell peppers, crunchy texture for salads & stir fries.")
                    .imageUrl("https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(60).lowStockThreshold(10).isAvailable(true).build(),

            Product.builder()
                    .name("Organic Baby Spinach (Palak)")
                    .sku("FV-SPN-009")
                    .category(fv)
                    .price(new BigDecimal("28.00"))
                    .originalPrice(new BigDecimal("35.00"))
                    .unit("1 Bunch (250 g)")
                    .description("Hydroponic tender green spinach leaves, iron-rich & chemical free.")
                    .imageUrl("https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(4).lowStockThreshold(5).isAvailable(true).build(),

            Product.builder()
                    .name("Fresh Crisp Royal Gala Apples")
                    .sku("FV-APL-010")
                    .category(fv)
                    .price(new BigDecimal("180.00"))
                    .originalPrice(new BigDecimal("220.00"))
                    .unit("1 kg Pack")
                    .description("Crisp, sweet Washington red Royal Gala apples.")
                    .imageUrl("https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(65).lowStockThreshold(10).isAvailable(true).build(),

            // 2. DAIRY & BAKERY
            Product.builder()
                    .name("Amul Pasteurised Toned Milk")
                    .sku("DB-MLK-001")
                    .category(db)
                    .price(new BigDecimal("34.00"))
                    .originalPrice(new BigDecimal("36.00"))
                    .unit("500 ml Pouch")
                    .description("Wholesome and pasteurised fresh toned milk.")
                    .imageUrl("https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(150).lowStockThreshold(20).isAvailable(true).build(),

            Product.builder()
                    .name("Amul Butter (Salted)")
                    .sku("DB-BTR-002")
                    .category(db)
                    .price(new BigDecimal("275.00"))
                    .originalPrice(new BigDecimal("290.00"))
                    .unit("500 g Pack")
                    .description("Delicious creamy butter made from pure cow milk.")
                    .imageUrl("https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(60).lowStockThreshold(10).isAvailable(true).build(),

            Product.builder()
                    .name("Artisan Whole Wheat Sourdough Bread")
                    .sku("DB-BRD-003")
                    .category(db)
                    .price(new BigDecimal("120.00"))
                    .originalPrice(new BigDecimal("150.00"))
                    .unit("400 g Loaf")
                    .description("Freshly baked 100% whole wheat artisanal sourdough bread.")
                    .imageUrl("https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(25).lowStockThreshold(5).isAvailable(true).build(),

            Product.builder()
                    .name("Fresh Cottage Cheese (Paneer)")
                    .sku("DB-PNR-004")
                    .category(db)
                    .price(new BigDecimal("115.00"))
                    .originalPrice(new BigDecimal("130.00"))
                    .unit("200 g Pack")
                    .description("Soft, rich and fresh malai paneer blocks.")
                    .imageUrl("https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(3).lowStockThreshold(5).isAvailable(true).build(),

            Product.builder()
                    .name("Mother Dairy Fresh Dahi / Curd")
                    .sku("DB-CRD-005")
                    .category(db)
                    .price(new BigDecimal("45.00"))
                    .originalPrice(new BigDecimal("50.00"))
                    .unit("400 g Tub")
                    .description("Thick, creamy and rich traditional fresh dahi.")
                    .imageUrl("https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(90).lowStockThreshold(15).isAvailable(true).build(),

            Product.builder()
                    .name("Britannia Gourmet Cheese Slices")
                    .sku("DB-CHS-006")
                    .category(db)
                    .price(new BigDecimal("140.00"))
                    .originalPrice(new BigDecimal("160.00"))
                    .unit("200 g Pack")
                    .description("Individually wrapped creamy cheddar cheese slices.")
                    .imageUrl("https://images.unsplash.com/photo-1624806992066-5ffcf7ca186b?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(55).lowStockThreshold(10).isAvailable(true).build(),

            // 3. BEVERAGES & JUICES
            Product.builder()
                    .name("Nescafe Classic Instant Coffee Jar")
                    .sku("BV-COF-001")
                    .category(bev)
                    .price(new BigDecimal("349.00"))
                    .originalPrice(new BigDecimal("399.00"))
                    .unit("100 g Jar")
                    .description("100% pure instant coffee powder with rich signature aroma.")
                    .imageUrl("https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(70).lowStockThreshold(10).isAvailable(true).build(),

            Product.builder()
                    .name("Tata Tea Gold Premium Black Tea")
                    .sku("BV-TEA-002")
                    .category(bev)
                    .price(new BigDecimal("290.00"))
                    .originalPrice(new BigDecimal("340.00"))
                    .unit("500 g Pack")
                    .description("Rich tea blend of gentle long leaf and CTC granules.")
                    .imageUrl("https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(90).lowStockThreshold(15).isAvailable(true).build(),

            Product.builder()
                    .name("Tropicana 100% Real Orange Juice")
                    .sku("BV-JUC-003")
                    .category(bev)
                    .price(new BigDecimal("145.00"))
                    .originalPrice(new BigDecimal("165.00"))
                    .unit("1 L Tetra")
                    .description("100% pure squeezed orange juice with no added sugar.")
                    .imageUrl("https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(50).lowStockThreshold(8).isAvailable(true).build(),

            Product.builder()
                    .name("Taj Mahal Premium Leaf Tea")
                    .sku("BV-TEA-004")
                    .category(bev)
                    .price(new BigDecimal("380.00"))
                    .originalPrice(new BigDecimal("420.00"))
                    .unit("500 g Pack")
                    .description("Strong aromatic Indian leaf tea with rich golden liquor.")
                    .imageUrl("https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(40).lowStockThreshold(8).isAvailable(true).build(),

            Product.builder()
                    .name("Real Fruit Power Mixed Fruit Juice")
                    .sku("BV-JUC-005")
                    .category(bev)
                    .price(new BigDecimal("130.00"))
                    .originalPrice(new BigDecimal("150.00"))
                    .unit("1 L Tetra")
                    .description("Delightful blend of 9 fruit juices enriched with Vitamin C.")
                    .imageUrl("https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(65).lowStockThreshold(10).isAvailable(true).build(),

            // 4. SNACKS & STAPLES
            Product.builder()
                    .name("Daawat Rozana Super Basmati Rice")
                    .sku("SK-RCE-001")
                    .category(snacks)
                    .price(new BigDecimal("425.00"))
                    .originalPrice(new BigDecimal("510.00"))
                    .unit("5 kg Bag")
                    .description("Aromatic long grain basmati rice ideal for daily meals & biryani.")
                    .imageUrl("https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(40).lowStockThreshold(10).isAvailable(true).build(),

            Product.builder()
                    .name("Fortune Sunlite Refined Sunflower Oil")
                    .sku("SK-OIL-002")
                    .category(snacks)
                    .price(new BigDecimal("155.00"))
                    .originalPrice(new BigDecimal("180.00"))
                    .unit("1 L Pouch")
                    .description("Light, healthy refined sunflower oil rich in Vitamin E.")
                    .imageUrl("https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(65).lowStockThreshold(10).isAvailable(true).build(),

            Product.builder()
                    .name("Cadbury Dairy Milk Silk Chocolate")
                    .sku("SK-CHO-003")
                    .category(snacks)
                    .price(new BigDecimal("175.00"))
                    .originalPrice(new BigDecimal("190.00"))
                    .unit("150 g Bar")
                    .description("Smooth, creamy chocolate bar that melts in your mouth.")
                    .imageUrl("https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(100).lowStockThreshold(15).isAvailable(true).build(),

            Product.builder()
                    .name("Tata Sampann Unpolished Toor Dal")
                    .sku("SK-DAL-004")
                    .category(snacks)
                    .price(new BigDecimal("165.00"))
                    .originalPrice(new BigDecimal("190.00"))
                    .unit("1 kg Pack")
                    .description("High-protein unpolished yellow pigeon peas.")
                    .imageUrl("https://images.unsplash.com/photo-1585994191611-72ec0d07e609?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(80).lowStockThreshold(12).isAvailable(true).build(),

            Product.builder()
                    .name("Aashirvaad Shuddh Chakki Whole Wheat Atta")
                    .sku("SK-ATA-005")
                    .category(snacks)
                    .price(new BigDecimal("245.00"))
                    .originalPrice(new BigDecimal("280.00"))
                    .unit("5 kg Bag")
                    .description("100% pure stone-ground whole wheat flour for soft rotis.")
                    .imageUrl("https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(50).lowStockThreshold(10).isAvailable(true).build(),

            Product.builder()
                    .name("Lay's India's Magic Masala Potato Chips")
                    .sku("SK-CHP-006")
                    .category(snacks)
                    .price(new BigDecimal("20.00"))
                    .originalPrice(new BigDecimal("20.00"))
                    .unit("50 g Pack")
                    .description("Crispy ridge-cut potato chips packed with spicy masala seasonings.")
                    .imageUrl("https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(200).lowStockThreshold(30).isAvailable(true).build(),

            // 5. HOUSEHOLD & CLEANING
            Product.builder()
                    .name("Surf Excel Matic Liquid Detergent")
                    .sku("HC-DET-001")
                    .category(household)
                    .price(new BigDecimal("380.00"))
                    .originalPrice(new BigDecimal("440.00"))
                    .unit("2 L Pouch")
                    .description("Superior stain removal liquid detergent for front & top load machines.")
                    .imageUrl("https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(35).lowStockThreshold(5).isAvailable(true).build(),

            Product.builder()
                    .name("Dettol Disinfectant Antiseptic Liquid")
                    .sku("HC-DET-002")
                    .category(household)
                    .price(new BigDecimal("210.00"))
                    .originalPrice(new BigDecimal("230.00"))
                    .unit("550 ml Bottle")
                    .description("Trusted 99.9% germ protection for first aid & household hygiene.")
                    .imageUrl("https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(50).lowStockThreshold(10).isAvailable(true).build(),

            Product.builder()
                    .name("Vim Dishwash Liquid Gel Lemon")
                    .sku("HC-VIM-003")
                    .category(household)
                    .price(new BigDecimal("185.00"))
                    .originalPrice(new BigDecimal("210.00"))
                    .unit("750 ml Bottle")
                    .description("Power of 100 lemons for tough grease cleaning on utensils.")
                    .imageUrl("https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(70).lowStockThreshold(10).isAvailable(true).build(),

            Product.builder()
                    .name("Harpic Power Plus Toilet Cleaner")
                    .sku("HC-HRP-004")
                    .category(household)
                    .price(new BigDecimal("195.00"))
                    .originalPrice(new BigDecimal("220.00"))
                    .unit("1 L Bottle")
                    .description("Disinfectant toilet cleaner removes 99.9% germs & tough stains.")
                    .imageUrl("https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(45).lowStockThreshold(8).isAvailable(true).build(),

            // 6. PERSONAL CARE
            Product.builder()
                    .name("Nivea Soft Light Moisturiser Cream")
                    .sku("PC-NIV-001")
                    .category(personal)
                    .price(new BigDecimal("299.00"))
                    .originalPrice(new BigDecimal("350.00"))
                    .unit("200 ml Tub")
                    .description("Non-greasy light moisturizing cream infused with Vitamin E & Jojoba Oil.")
                    .imageUrl("https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(40).lowStockThreshold(5).isAvailable(true).build(),

            Product.builder()
                    .name("Colgate MaxFresh Red Gel Toothpaste")
                    .sku("PC-CLG-002")
                    .category(personal)
                    .price(new BigDecimal("135.00"))
                    .originalPrice(new BigDecimal("155.00"))
                    .unit("150 g Pack of 2")
                    .description("Cooling crystals gel toothpaste for intense long-lasting fresh breath.")
                    .imageUrl("https://images.unsplash.com/photo-1559598467-f8b76c8155d0?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(80).lowStockThreshold(12).isAvailable(true).build(),

            Product.builder()
                    .name("Dove Cream Beauty Bathing Soap Bar")
                    .sku("PC-DOV-003")
                    .category(personal)
                    .price(new BigDecimal("190.00"))
                    .originalPrice(new BigDecimal("220.00"))
                    .unit("Pack of 4 x 100g")
                    .description("1/4 moisturizing cream formula for soft, smooth skin.")
                    .imageUrl("https://images.unsplash.com/photo-1607006482602-53b3daef5d17?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(95).lowStockThreshold(15).isAvailable(true).build(),

            Product.builder()
                    .name("L'Oreal Paris Total Repair 5 Shampoo")
                    .sku("PC-LOR-004")
                    .category(personal)
                    .price(new BigDecimal("280.00"))
                    .originalPrice(new BigDecimal("330.00"))
                    .unit("340 ml Bottle")
                    .description("Fights 5 visible signs of damaged hair: hair fall, dryness, roughness, dullness, split ends.")
                    .imageUrl("https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80")
                    .stockQuantity(50).lowStockThreshold(10).isAvailable(true).build()
        };

        productRepository.saveAll(List.of(products));
    }
}
