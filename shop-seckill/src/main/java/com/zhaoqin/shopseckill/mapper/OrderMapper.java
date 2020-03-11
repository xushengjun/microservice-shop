package com.zhaoqin.shopseckill.mapper;

import com.zhaoqin.shopcommon.entity.OrderInfo;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

/**
 * @ClassName OrderMapper
 * @Author zhaoqin
 * @Date 2020/3/4
 */
@Mapper
public interface OrderMapper {

    long insert(OrderInfo orderInfo);

}
