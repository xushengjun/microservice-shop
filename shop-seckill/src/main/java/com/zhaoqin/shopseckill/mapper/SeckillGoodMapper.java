package com.zhaoqin.shopseckill.mapper;

import com.zhaoqin.shopcommon.bo.GoodsBo;
import com.zhaoqin.shopcommon.entity.Goods;
import com.zhaoqin.shopcommon.entity.SeckillGoods;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * @ClassName GoodMapper
 * @Author zhaoqin
 * @Date 2020/3/4
 */
@Mapper
public interface SeckillGoodMapper {

    /**
     * 获取
     * @param seckillGoodId
     * @return
     */
    SeckillGoods getSeckillGood(long seckillGoodId);

    /**
     * 获取所有的秒杀商品
     * @return
     */
    List<SeckillGoods> getSeckillGoodList();
}
