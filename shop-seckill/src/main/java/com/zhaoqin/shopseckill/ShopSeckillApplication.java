package com.zhaoqin.shopseckill;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;

@ComponentScan("com.zhaoqin")
@EnableEurekaClient
@SpringBootApplication
@EnableRedisHttpSession(maxInactiveIntervalInSeconds = 1800)
public class ShopSeckillApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShopSeckillApplication.class, args);
    }

}
