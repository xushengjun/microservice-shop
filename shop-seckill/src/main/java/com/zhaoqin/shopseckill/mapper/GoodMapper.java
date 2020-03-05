package com.zhaoqin.shopseckill.mapper;

import com.zhaoqin.shopcommon.bo.GoodsBo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * @ClassName GoodMapper
 * @Author zhaoqin
 * @Date 2020/3/4
 */
@Mapper
public interface GoodMapper {

    /**
     * 获取所有商品
     * @return
     */
    List<GoodsBo> getGoodList();
}
