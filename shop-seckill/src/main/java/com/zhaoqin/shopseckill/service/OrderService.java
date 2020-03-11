package com.zhaoqin.shopseckill.service;

import com.zhaoqin.shopcommon.mq.message.SeckillMessage;

/**
 * @ClassName OrderService
 * @Author zhaoqin
 * @Date 2020/3/4
 */
public interface OrderService {

    long insert(SeckillMessage message);
}
