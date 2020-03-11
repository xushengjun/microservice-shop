package com.zhaoqin.shopseckill.mq.receiver;

import com.zhaoqin.shopcommon.bo.GoodsBo;
import com.zhaoqin.shopcommon.config.SeckillRabbitConfig;
import com.zhaoqin.shopcommon.entity.SeckillGoods;
import com.zhaoqin.shopcommon.entity.SeckillOrder;
import com.zhaoqin.shopcommon.mq.message.SeckillMessage;
import com.zhaoqin.shopseckill.service.GoodService;
import com.zhaoqin.shopseckill.service.SeckillOrderService;
import com.zhaoqin.shopseckill.service.imp.SeckillGoodServiceImp;
import com.zhaoqin.shopseckill.service.imp.SeckillOrderServiceImp;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @ClassName SeckillReceiver
 * @Author zhaoqin
 * @Date 2020/3/8
 */
@Component
public class SeckillReceiver {
    @Autowired
    private SeckillGoodServiceImp seckillGoodService;
    @Autowired
    private SeckillOrderServiceImp seckillOrderService;


    /**
     * 订单服务消费订单
     * @param message
     */
    @RabbitListener(queues= SeckillRabbitConfig.MIAOSHA_QUEUE)
    public void receiver(SeckillMessage message){

        //判断商品库存
        SeckillGoods seckillGood = seckillGoodService.getSeckillGood(message.getGoodsId());
        long stockCount = seckillGood.getStockCount();
        if(stockCount <= 0) {
            return;
        }

        //判断是否已经秒杀到了
        SeckillOrder seckillOrder = seckillOrderService.getSeckillOrderByUserIdGoodId(message.getUser().getId(), message.getGoodsId());
        if(seckillOrder != null) {
            return;
        }

        // 减库存 下订单 存秒杀记录
        // 减库存失败 说明秒杀商品没有 结束秒杀标记(redis)
        seckillOrderService.makeOrder(message);


    }

}
