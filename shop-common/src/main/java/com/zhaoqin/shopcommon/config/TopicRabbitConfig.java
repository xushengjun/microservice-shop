package com.zhaoqin.shopcommon.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @ClassName TopicRabbitMqConfig
 * @Author zhaoqin
 * @Date 2020/3/8
 */
@Configuration
public class TopicRabbitConfig {

    /**
     * topic订阅模式
     * #：匹配一个或多个词	user.#：能够匹配user.insert.save 或者 user.insert
     * *：匹配不多不少恰好1个词	user.*：只能匹配user.insert
     */

    @Bean
    public Queue queueMessage() {
        return new Queue("q_topic_message");
    }

    @Bean
    public Queue queueMessages() {
        return new Queue("q_topic_messages");
    }

    /**
     * 声明一个Topic类型的交换机
     * @return
     */
    @Bean
    public TopicExchange exchange() {
        return new TopicExchange("mybootexchange");
    }

    /**
     * 绑定Q队列到交换机,并且指定routingKey
     * @param queueMessage
     * @param exchange
     * @return
     */
    @Bean
    public Binding bindingExchangeMessage(Queue queueMessage, TopicExchange exchange) {
        return BindingBuilder.bind(queueMessage).to(exchange).with("topic.message");
    }

    @Bean
    public Binding bindingExchangeMessages(Queue queueMessages, TopicExchange exchange) {
        return BindingBuilder.bind(queueMessages).to(exchange).with("topic.#");
    }
}
