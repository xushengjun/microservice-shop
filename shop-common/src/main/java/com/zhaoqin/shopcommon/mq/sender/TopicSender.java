package com.zhaoqin.shopcommon.mq.sender;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @ClassName TopicSender
 * @Author zhaoqin
 * @Date 2020/3/8
 */
@Component
public class TopicSender {

        @Autowired
        private AmqpTemplate rabbitTemplate;

        /**
         * 这里的mybootexchange是交换机的名称字符串和发送消息时的名称必须相同
         * 具体代码发送的情形如下，第一个参数表示交换机，第二个参数表示 routing key，第三个参数即消息。如下：
         * this.rabbitTemplate.convertAndSend("mybootexchange", "topic.message", context);
         */
        public void send1() {
            String context = "hi, i am message 1";
            System.out.println("Sender : " + context);
            this.rabbitTemplate.convertAndSend("mybootexchange", "topic.message", context);
        }


        public void send2() {
            String context = "hi, i am messages 2";
            System.out.println("Sender : " + context);
            this.rabbitTemplate.convertAndSend("mybootexchange", "topic.messages", context);
        }

}
