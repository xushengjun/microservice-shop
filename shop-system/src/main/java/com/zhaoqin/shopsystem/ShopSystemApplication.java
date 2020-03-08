package com.zhaoqin.shopsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.ComponentScan;

@ComponentScan("com.zhaoqin")//重要
@EnableEurekaClient
@SpringBootApplication
public class ShopSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShopSystemApplication.class, args);
    }

}
