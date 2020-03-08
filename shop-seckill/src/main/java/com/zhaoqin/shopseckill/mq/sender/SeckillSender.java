package com.zhaoqin.shopseckill.mq.sender;

import com.zhaoqin.shopcommon.config.SeckillRabbitConfig;
import com.zhaoqin.shopcommon.mq.message.SeckillMessage;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @ClassName SeckillSender
 * @Author zhaoqin
 * @Date 2020/3/8
 */
@Component
public class SeckillSender {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    /**
     * 将秒杀信息发送到秒杀队列
     * @param message
     */
    public void sendToSeckillQueue(SeckillMessage message){
        String date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());//24小时制
        message.setSeckillDate(date);
        this.rabbitTemplate.convertAndSend(SeckillRabbitConfig.MIAOSHA_QUEUE, message);
    }
}
