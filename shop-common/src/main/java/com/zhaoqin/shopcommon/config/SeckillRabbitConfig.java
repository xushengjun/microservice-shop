package com.zhaoqin.shopcommon.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 使用work_queue
 * 秒杀消息队列配合
 * @ClassName SeckillRabbitConfig
 * @Author zhaoqin
 * @Date 2020/3/8
 */
@Configuration
public class SeckillRabbitConfig {
    public static final String MIAOSHA_QUEUE = "miaosha_queue";

    @Bean
    public Queue miaosha_queue() {
        return new Queue(MIAOSHA_QUEUE);
    }
}
