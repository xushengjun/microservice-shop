package com.zhaoqin.shopseckill.mapper;

import com.zhaoqin.shopcommon.entity.SeckillOrder;
import org.apache.ibatis.annotations.Mapper;

/**
 * @ClassName SeckillOrderMapper
 * @Author zhaoqin
 * @Date 2020/3/7
 */
@Mapper
public interface SeckillOrderMapper  {

    SeckillOrder getSeckillOrderByUserIdGoodId(long userId, long goodId);
}
