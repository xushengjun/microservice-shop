package com.zhaoqin.shopseckill.service.imp;

import com.zhaoqin.shopcommon.entity.SeckillOrder;
import com.zhaoqin.shopseckill.mapper.SeckillOrderMapper;
import com.zhaoqin.shopseckill.service.SeckillOrderService;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Service;

/**
 * @ClassName SeckillOrderServiceImp
 * @Author zhaoqin
 * @Date 2020/3/7
 */
@Service
public class SeckillOrderServiceImp implements SeckillOrderService {
    @Mapper
    private SeckillOrderMapper mapper;

    /**
     * 根据userId goodId 获取秒杀订单信息
     * @return
     * @param userId
     * @param goodId
     */
    public SeckillOrder getSeckillOrderByUserIdGoodId(String userId, String goodId){
        return mapper.getSeckillOrderByUserIdGoodId(userId, goodId);
    }
}
