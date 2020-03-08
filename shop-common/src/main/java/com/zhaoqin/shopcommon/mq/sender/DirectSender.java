package com.zhaoqin.shopcommon.mq.sender;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @ClassName DirectSender
 * @Author zhaoqin
 * @Date 2020/3/8
 */
@Component
public class DirectSender {
    @Autowired
    private AmqpTemplate rabbitTemplate;

    public void send(){
        String context = "hi, direct msg ";
        System.out.println("Sender : " + context);
        this.rabbitTemplate.convertAndSend("mybootdirectExchange","topic", context);
    }

}
