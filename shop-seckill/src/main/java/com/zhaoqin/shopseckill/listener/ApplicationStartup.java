package com.zhaoqin.shopseckill.listener;

import com.zhaoqin.shopcommon.constant.RedisConstant;
import com.zhaoqin.shopcommon.constant.TimeConstant;
import com.zhaoqin.shopcommon.entity.SeckillGoods;
import com.zhaoqin.shopseckill.service.SeckillOrderService;
import com.zhaoqin.shopseckill.service.imp.SeckillGoodServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.ApplicationListener;
import org.springframework.context.EnvironmentAware;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.core.env.Environment;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @ClassName ApplicationStartup
 * @Author zhaoqin
 * @Date 2020/3/12
 */
public class ApplicationStartup implements CommandLineRunner {
   @Autowired
   private SeckillGoodServiceImp seckillGoodServiceImp;
   @Autowired
   private ValueOperations<String, String> valueOperations;

//    @Override
//    public void onApplicationEvent(ContextRefreshedEvent contextRefreshedEvent) {
//        loadStock();
//    }

    /**
     * 初始化加载秒杀商品库存
     */
    public void loadStock(){
        List<SeckillGoods> seckillGoodList = seckillGoodServiceImp.getSeckillGoodList();
        for (SeckillGoods seckillGoods : seckillGoodList) {
            if(seckillGoods.getStockCount() < 0)
                continue;
            //初始化,把商品库存存进缓存
            valueOperations.set(RedisConstant.seckillGoodKey + "" + seckillGoods.getId(), "" + seckillGoods.getStockCount(), TimeConstant.GOODS_LIST);
        }
    }

    @Override
    public void run(String... args) throws Exception {
        loadStock();
    }

}
