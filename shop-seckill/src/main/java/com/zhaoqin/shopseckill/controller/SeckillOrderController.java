package com.zhaoqin.shopseckill.controller;

import com.zhaoqin.shopcommon.entity.Goods;
import com.zhaoqin.shopcommon.entity.SeckillGoods;
import com.zhaoqin.shopcommon.util.ResultData;
import com.zhaoqin.shopseckill.service.imp.SeckillGoodServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @ClassName SeckillOrderController
 * @Author zhaoqin
 * @Date 2020/3/7
 */
@RestController
@RequestMapping("seckillGood")
public class SeckillOrderController {
    @Autowired
    private SeckillGoodServiceImp service;

    @GetMapping("{id}")
    public ResultData getGood(
            @PathVariable("id") String seckillGoodId
    ){
        SeckillGoods seckillGood = service.getSeckillGood(seckillGoodId);
        return ResultData.ok(seckillGood, "查询成功");
    }
}
