package com.zhaoqin.shopseckill.service;

import com.zhaoqin.shopcommon.bo.GoodsBo;

import java.util.List;

/**
 * @ClassName GoodService
 * @Author zhaoqin
 * @Date 2020/3/4
 */
public interface GoodService {

    /**
     * 获取所有商品
     * @return
     */
    List<GoodsBo> getGoodList();
}
