package com.zhaoqin.shopseckill.controller;

import com.zhaoqin.shopcommon.util.ResultData;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

/**
 * @ClassName SeckillController
 * @Author zhaoqin
 * @Date 2020/3/4
 */
@RestController
@RequestMapping("seckill")
public class SeckillController {

    @PutMapping("/good/{id}")
    public ResultData seckillGood(
            @PathVariable("id") String id
    ){
        // 优化 系统初始化的时候,将商品库存存入redis

        // 1 从redis取出用户，判断是否登录

        // 2 根据userId 和 goodId 判断订单是否存在 不能重复下单

        // 3 从redis中获取商品库存 预减库存

        // 4 判断库存

        // 5 将userId 和 goodId封装成消息,入rabbitMq队列

        return null;
    }
}
