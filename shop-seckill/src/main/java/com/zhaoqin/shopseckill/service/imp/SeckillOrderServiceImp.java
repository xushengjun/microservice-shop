package com.zhaoqin.shopseckill.service.imp;

import com.zhaoqin.shopcommon.entity.SeckillOrder;
import com.zhaoqin.shopcommon.mq.message.SeckillMessage;
import com.zhaoqin.shopseckill.mapper.SeckillOrderMapper;
import com.zhaoqin.shopseckill.service.OrderService;
import com.zhaoqin.shopseckill.service.SeckillOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @ClassName SeckillOrderServiceImp
 * @Author zhaoqin
 * @Date 2020/3/7
 */
@Service
public class SeckillOrderServiceImp implements SeckillOrderService {
    @Autowired
    private SeckillOrderMapper mapper;
    @Autowired
    private OrderService orderService;
    @Autowired
    private SeckillOrderService seckillOrderService;


    /**
     * 根据userId goodId 获取秒杀订单信息
     * @return
     * @param userId
     * @param goodId
     */
    public SeckillOrder getSeckillOrderByUserIdGoodId(long userId, long goodId){
        return mapper.getSeckillOrderByUserIdGoodId(userId, goodId);
    }

    /**
     * 用户秒杀到商品之后的操作
     * 减库存成功
     *      下订单
     *      下秒杀订单
     * 减库存失败 -> 没货
     *      redis中结束秒杀标记(true-> 秒杀结束， false-> 秒杀未结束)
     *
     * @param message
     */
    @Transactional
    public void makeOrder(SeckillMessage message) {
        //1 减库存
        if(!reduceStock(message)){
            return;
            //结束秒杀标记
        }

        //2 order_info 存订单信息
        long orderId = orderService.insert(message);

        //3 seckill_order 存订单信息
        seckillOrderService.insert(message, orderId);
    }

    /**
     * 减库存
     */
    public boolean reduceStock(SeckillMessage message){
        int updateRow = mapper.reduceStock(message.getGoodsId());
        if(updateRow > 0)
            return true;
        return false;
    }

    /**
     * 新增
     * @param message
     * @param orderId
     */
    public void insert(SeckillMessage message, long orderId) {
        SeckillOrder seckillOrder = new SeckillOrder();
        seckillOrder.setGoodsId(message.getGoodsId());
        seckillOrder.setUserId(message.getUser().getId());
        seckillOrder.setOrderId(orderId);
        mapper.insert(seckillOrder);
    }
}
