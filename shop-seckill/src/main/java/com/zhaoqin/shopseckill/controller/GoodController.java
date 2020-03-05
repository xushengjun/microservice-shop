package com.zhaoqin.shopseckill.controller;

import com.sun.corba.se.impl.encoding.CDROutputObject;
import com.zhaoqin.shopcommon.bo.GoodsBo;
import com.zhaoqin.shopcommon.entity.Goods;
import com.zhaoqin.shopcommon.util.ResultData;
import com.zhaoqin.shopseckill.service.GoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @ClassName GoodController
 * @Author zhaoqin
 * @Date 2020/3/4
 */
@RestController
@RequestMapping("good")
public class GoodController {
    @Autowired
    private GoodService service;

    @GetMapping("goods")
    public ResultData getGoodList() {
        List<GoodsBo> goodList = service.getGoodList();
        return ResultData.ok(goodList, "查询成功");
    }

}
