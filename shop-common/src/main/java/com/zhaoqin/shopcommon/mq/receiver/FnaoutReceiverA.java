package com.zhaoqin.shopcommon.mq.receiver;

/**
 * @ClassName FnaoutReceiverA
 * @Author zhaoqin
 * @Date 2020/3/8
 */
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RabbitListener(queues = "q_fanout_A")
public class FnaoutReceiverA {

    @RabbitHandler
    public void process(String hello) {
        System.out.println("AReceiver  : " + hello + "/n");
    }
}

