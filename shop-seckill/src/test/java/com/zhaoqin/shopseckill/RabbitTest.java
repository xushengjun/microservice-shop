package com.zhaoqin.shopseckill;

import com.zhaoqin.shopcommon.mq.sender.DirectSender;
import com.zhaoqin.shopcommon.mq.sender.FanoutSender;
import com.zhaoqin.shopcommon.mq.sender.HelloSender;
import com.zhaoqin.shopcommon.mq.sender.TopicSender;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * 测试
 * @ClassName RabbitTest
 * @Author zhaoqin
 * @Date 2020/3/8
 */
@RunWith(SpringRunner.class)
@ActiveProfiles("dev")
@SpringBootTest
public class RabbitTest {
    @Autowired
    private HelloSender helloSender;
    @Autowired
    private TopicSender topicSender;
    @Autowired
    private FanoutSender fanoutSender;
    @Autowired
    private DirectSender directSender;

    //基本消息模式  直接模式 单对单
    @Test
    public void hello() throws Exception {
        helloSender.send();
    }

    /**
     * work消息模型：生产者–>队列–>多个消费者共同消费
     */
    @Test
    public void hello2() throws InterruptedException {
        for (int i = 0; i < 100; i++){
            helloSender.send(i);
            Thread.sleep(300);
        }
    }

    @Test
    public void topic1(){
        topicSender.send1();
    }

    @Test
    public void topic2()
    {
        topicSender.send2();
    }

    @Test
    public void fanout(){
        fanoutSender.send();
    }

    @Test
    public void direct(){
        directSender.send();
    }

}
