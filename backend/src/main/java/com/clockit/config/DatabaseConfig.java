package com.clockit.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.url:#{null}}")
    private String datasourceUrl;

    @Value("${spring.datasource.username:#{null}}")
    private String datasourceUsername;

    @Value("${spring.datasource.password:#{null}}")
    private String datasourcePassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String databaseUrlEnv = System.getenv("DATABASE_URL");
        String finalUrl = datasourceUrl;
        String username = datasourceUsername;
        String password = datasourcePassword;

        // If DATABASE_URL is provided by cloud provider (Render, Railway, Heroku, Supabase, Neon)
        if (databaseUrlEnv != null && !databaseUrlEnv.isBlank() && !databaseUrlEnv.startsWith("jdbc:")) {
            try {
                URI dbUri = new URI(databaseUrlEnv);
                String userInfo = dbUri.getUserInfo();
                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    username = parts[0];
                    password = parts[1];
                }
                int port = dbUri.getPort() == -1 ? 5432 : dbUri.getPort();
                String path = dbUri.getPath();
                finalUrl = "jdbc:postgresql://" + dbUri.getHost() + ":" + port + path;

                // Handle query parameters and enforce SSL on cloud hosts
                if (dbUri.getQuery() != null && !dbUri.getQuery().isBlank()) {
                    finalUrl += "?" + dbUri.getQuery();
                } else if (!dbUri.getHost().equals("localhost") && !dbUri.getHost().equals("127.0.0.1") && !dbUri.getHost().equals("postgres")) {
                    finalUrl += "?sslmode=require";
                }
                log.info("Successfully converted cloud DATABASE_URL to JDBC: {} for user: {}", finalUrl, username);
            } catch (URISyntaxException e) {
                log.warn("Failed to parse DATABASE_URL as URI, using configured datasource url: {}", e.getMessage());
                finalUrl = databaseUrlEnv;
            }
        }

        String effectiveUrl = finalUrl != null && !finalUrl.isBlank() ? finalUrl : "jdbc:postgresql://localhost:5432/clockit_db";
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(effectiveUrl);
        if (username != null && !username.isBlank()) {
            config.setUsername(username);
        }
        if (password != null) {
            config.setPassword(password);
        }
        if (effectiveUrl.startsWith("jdbc:postgresql:")) {
            config.setDriverClassName("org.postgresql.Driver");
        } else if (effectiveUrl.startsWith("jdbc:h2:")) {
            config.setDriverClassName("org.h2.Driver");
        }
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setIdleTimeout(30000);
        config.setPoolName("ClockItHikariPool");

        return new HikariDataSource(config);
    }
}
