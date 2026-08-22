package com.example.mini_dmart.config;

import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import com.zaxxer.hikari.HikariDataSource;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        String url = properties.getUrl();
        if (url != null && !url.isBlank()) {
            if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
                try {
                    String cleanUrl = url.startsWith("postgres://") ? 
                            "http" + url.substring(8) : "http" + url.substring(10);
                    URI uri = URI.create(cleanUrl);

                    if (uri.getUserInfo() != null) {
                        String[] userInfo = uri.getUserInfo().split(":", 2);
                        if (userInfo.length > 0 && (properties.getUsername() == null || properties.getUsername().isBlank() || properties.getUsername().equals("postgres"))) {
                            properties.setUsername(userInfo[0]);
                        }
                        if (userInfo.length > 1 && (properties.getPassword() == null || properties.getPassword().isBlank() || properties.getPassword().equals("Darshan"))) {
                            properties.setPassword(userInfo[1]);
                        }
                    }

                    String query = uri.getQuery() != null ? "?" + uri.getQuery() : "";
                    int port = uri.getPort() != -1 ? uri.getPort() : 5432;
                    String jdbcUrl = "jdbc:postgresql://" + uri.getHost() + ":" + port + uri.getPath() + query;
                    properties.setUrl(jdbcUrl);
                } catch (Exception e) {
                    if (url.startsWith("postgres://")) {
                        url = url.replace("postgres://", "jdbc:postgresql://");
                    } else if (url.startsWith("postgresql://")) {
                        url = url.replace("postgresql://", "jdbc:postgresql://");
                    }
                    properties.setUrl(url);
                }
            }
        }
        return properties.initializeDataSourceBuilder().type(HikariDataSource.class).build();
    }
}
