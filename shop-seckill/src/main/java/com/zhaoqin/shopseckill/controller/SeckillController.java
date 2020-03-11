package com.zhaoqin.shopseckill.controller;

import com.zhaoqin.shopcommon.constant.BaseConstant;
import com.zhaoqin.shopcommon.constant.RedisConstant;
import com.zhaoqin.shopcommon.entity.SeckillGoods;
import com.zhaoqin.shopcommon.entity.SeckillOrder;
import com.zhaoqin.shopcommon.entity.User;
import com.zhaoqin.shopcommon.mq.message.SeckillMessage;
import com.zhaoqin.shopcommon.util.ResultData;
import com.zhaoqin.shopseckill.mq.sender.SeckillSender;
import com.zhaoqin.shopseckill.service.SeckillOrderService;
import com.zhaoqin.shopseckill.service.imp.SeckillGoodServiceImp;
import com.zhaoqin.shopseckill.service.imp.SeckillOrderServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.ValueOperations;
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
    private ValueOperations<String, String> valueOperations;
    @Autowired
    private HashOperations<String, String, User> hashOperations;
    @Autowired
    private SeckillOrderService seckillOrderService;
    @Autowired
    private SeckillGoodServiceImp seckillGoodServiceImp;
    @Autowired
    private SeckillSender seckillSender;

    @PutMapping("good/{id}")
    public ResultData seckillGood(
            @PathVariable("id") Long goodId,
            HttpSession session
    ){
        // 优化 系统初始化的时候,将商品库存存入redis

        // 1 从redis (或session 如果是session 微服务之间怎么共享session )取出用户，判断是否登录
        long userId  = Long.valueOf(valueOperations.get(BaseConstant.USER_ID));
        User user = hashOperations.get(RedisConstant.userKey, String.valueOf(userId));
        if(user == null)
            return ResultData.error("用户未登陆");

        // 2 根据userId 和 goodId 判断订单是否存在 不能重复下单
        SeckillOrder seckillOrderInstanse = seckillOrderService.getSeckillOrderByUserIdGoodId(userId, goodId);
        if(seckillOrderInstanse != null)
            return ResultData.error(1212121, "不能重复下单");

        // 3 从redis中获取商品库存 预减库存

        // 4 判断库存
        SeckillGoods seckillGood = seckillGoodServiceImp.getSeckillGood(goodId);
        if(seckillGood.getStockCount() < 1)
            return ResultData.error(-1212122,"没有剩余商品！");

        // 5 将user 和 goodId封装成消息,入rabbitMq队列
        SeckillMessage message = new SeckillMessage(user, goodId);
        seckillSender.sendToSeckillQueue(message);

        return ResultData.ok(0,"排队中");
    }
}
