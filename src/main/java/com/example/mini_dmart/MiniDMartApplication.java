package com.example.mini_dmart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.example.mini_dmart.repository")
@EntityScan(basePackages = "com.example.mini_dmart.model")
public class MiniDMartApplication {

    public static void main(String[] args) {
        SpringApplication.run(MiniDMartApplication.class, args);
    }
}
