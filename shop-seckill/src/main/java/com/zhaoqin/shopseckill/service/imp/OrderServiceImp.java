package com.zhaoqin.shopseckill.service.imp;

import com.zhaoqin.shopcommon.entity.OrderInfo;
import com.zhaoqin.shopcommon.mq.message.SeckillMessage;
import com.zhaoqin.shopseckill.mapper.OrderMapper;
import com.zhaoqin.shopseckill.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @ClassName OrderServiceImp
 * @Author zhaoqin
 * @Date 2020/3/4
 */
@Service
public class OrderServiceImp implements OrderService {
    @Autowired
    private OrderMapper mapper;

    //下订单
    public long insert(SeckillMessage message) {
        OrderInfo orderInfo = new OrderInfo();
        orderInfo.setUserId(message.getUser().getId());
        orderInfo.setGoodsId(message.getGoodsId());
        //其他暂时不存
        long primaryKeyValue  =mapper.insert(orderInfo);
        return primaryKeyValue;
    }
}
