package com.zhaoqin.shopcommon.mq.receiver;
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
 * 基本消息模型：生产者–>队列–>消费者
 * work消息模型：生产者–>队列–>多个消费者共同消费
 * @ClassName HelloReceiver
 * @Author zhaoqin
 * @Date 2020/3/8
 */
@Component
@RabbitListener(queues = "q_hello")
public class HelloReceiver {

    @RabbitHandler
    public void process(String hello) {
        System.out.println("Receiver  : " + hello);
    }
}

