package com.zhaoqin.shopseckill.service;

import com.zhaoqin.shopcommon.entity.SeckillOrder;
import com.zhaoqin.shopcommon.mq.message.SeckillMessage;
import org.springframework.stereotype.Service;

/**
 * @ClassName SeckillOrderService
 * @Author zhaoqin
 * @Date 2020/3/7
 */
@Service
public interface SeckillOrderService {

    SeckillOrder getSeckillOrderByUserIdGoodId(long userId, long goodId);

    void makeOrder(SeckillMessage message);

    void insert(SeckillMessage message, long orderId);
}
