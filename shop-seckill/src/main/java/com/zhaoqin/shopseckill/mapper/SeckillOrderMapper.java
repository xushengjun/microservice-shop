package com.zhaoqin.shopseckill.mapper;

import com.zhaoqin.shopcommon.entity.SeckillOrder;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Service;

/**
 * @ClassName SeckillOrderMapper
 * @Author zhaoqin
 * @Date 2020/3/7
 */
@Mapper
public interface SeckillOrderMapper  {

    SeckillOrder getSeckillOrderByUserIdGoodId(long userId, long goodId);

    int reduceStock(long id);

    @Select("insert into seckill_order(user_id, goods_id, order_id) values(#{userId}, #{goodsId}, #{orderId}) ")
    void insert(SeckillOrder seckillOrder);
}
