package com.zhaoqin.shopseckill.service.imp;

import com.zhaoqin.shopcommon.bo.GoodsBo;
import com.zhaoqin.shopcommon.entity.Goods;
import com.zhaoqin.shopcommon.entity.SeckillGoods;
import com.zhaoqin.shopseckill.mapper.GoodMapper;
import com.zhaoqin.shopseckill.mapper.SeckillGoodMapper;
import com.zhaoqin.shopseckill.service.GoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @ClassName GoodServiceImp
 * @Author zhaoqin
 * @Date 2020/3/4
 */
@Service
public class SeckillGoodServiceImp {
    @Autowired
    private SeckillGoodMapper mapper;

    public SeckillGoods getSeckillGood(String seckillGoodId) {
        return mapper.getSeckillGood(seckillGoodId);
    }
}
