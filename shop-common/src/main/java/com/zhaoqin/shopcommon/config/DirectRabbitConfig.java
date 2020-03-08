package com.zhaoqin.shopcommon.config;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @ClassName DirectRabbitConfig
 * @Author zhaoqin
 * @Date 2020/3/8
 */
@Configuration
public class DirectRabbitConfig {

        @Bean
        public Queue q_direct_A() {
            return new Queue("q_direct_A");
        }

        @Bean
        public Queue q_direct_B() {
            return new Queue("q_direct_B");
        }

        @Bean
        public Queue q_direct_C() {
            return new Queue("q_direct_C");
        }

        @Bean
        DirectExchange directExchange() {
            return new DirectExchange("mybootdirectExchange");
        }

        @Bean
        Binding bindingExchangeDA(Queue q_direct_A, DirectExchange directExchange) {
            return BindingBuilder.bind(q_direct_A).to(directExchange).with("topic");
        }

        @Bean
        Binding bindingExchangeDB(Queue q_direct_B, DirectExchange directExchange) {
            return BindingBuilder.bind(q_direct_B).to(directExchange).with("topic");
        }

        @Bean
        Binding bindingExchangeDC(Queue q_direct_C, DirectExchange directExchange) {
            return BindingBuilder.bind(q_direct_C).to(directExchange).with("topic");
        }

}
