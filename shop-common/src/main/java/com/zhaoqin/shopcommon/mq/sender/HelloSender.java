package com.zhaoqin.shopcommon.mq.sender;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 基本消息模型：生产者–>队列–>消费者
 * work消息模型：生产者–>队列–>多个消费者共同消费
 * @ClassName HelloSender
 * @Author zhaoqin
 * @Date 2020/3/8
 */
@Component
public class HelloSender {

        @Autowired
        private AmqpTemplate rabbitTemplate;

    /**
     * 基本消息模型：生产者–>队列–>消费者
     */
    public void send() {
            String date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());//24小时制
            String context = "hello " + date;
            System.out.println("Sender : " + context);
            //简单对列的情况下routingKey即为Q名
            this.rabbitTemplate.convertAndSend("q_hello", context);
        }

    /**
     * work消息模型：生产者–>队列–>多个消费者共同消费
     * @param i
     */
    public void send(int i){
        String date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());//24小时制
        String context = "hello " + i + " "+date;
        System.out.println("Sender : " + context);
        //简单对列的情况下routingKey即为Q名
        this.rabbitTemplate.convertAndSend("q_hello", context);
    }

}

