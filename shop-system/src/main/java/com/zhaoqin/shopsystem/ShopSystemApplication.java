package com.zhaoqin.shopsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@EnableEurekaClient
@SpringBootApplication
public class ShopSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShopSystemApplication.class, args);
    }

}
