package com.zhaoqin.shopseckill.controller;

import com.zhaoqin.shopcommon.constant.BaseConstant;
import com.zhaoqin.shopcommon.constant.RedisConstant;
import com.zhaoqin.shopcommon.entity.SeckillGoods;
import com.zhaoqin.shopcommon.entity.SeckillOrder;
import com.zhaoqin.shopcommon.entity.User;
import com.zhaoqin.shopcommon.util.ResultData;
import com.zhaoqin.shopseckill.service.imp.SeckillGoodServiceImp;
import com.zhaoqin.shopseckill.service.imp.SeckillOrderServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

/**
 * @ClassName SeckillController
 * @Author zhaoqin
 * @Date 2020/3/4
 */
@RestController
@RequestMapping("seckill")
public class SeckillController {
    @Autowired
    private HashOperations<String, String, User> hashOperations;
    @Autowired
    private SeckillOrderServiceImp seckillOrderService;
    @Autowired
    private SeckillGoodServiceImp seckillGoodServiceImp;

    @PutMapping("/good/{id}")
    public ResultData seckillGood(
            @PathVariable("id") String goodId,
            HttpSession session
    ){
        // 优化 系统初始化的时候,将商品库存存入redis

        // 1 从redis (或session)取出用户，判断是否登录
        String userId = (String)session.getAttribute(BaseConstant.USER_ID);
        if((User)session.getAttribute(userId) == null)
            return ResultData.error("用户未登陆");

        // 2 根据userId 和 goodId 判断订单是否存在 不能重复下单
        SeckillOrder seckillOrderInstanse = seckillOrderService.getSeckillOrderByUserIdGoodId(userId, goodId);
        if(seckillOrderInstanse != null)
            return ResultData.error("不能重复下单");

        // 3 从redis中获取商品库存 预减库存

        // 4 判断库存
        SeckillGoods seckillGood = seckillGoodServiceImp.getSeckillGood(goodId);
        if(seckillGood.getStockCount() < 1)
            return ResultData.error("没有剩余商品！");

        // 5 将userId 和 goodId封装成消息,入rabbitMq队列

        return null;
    }
}
