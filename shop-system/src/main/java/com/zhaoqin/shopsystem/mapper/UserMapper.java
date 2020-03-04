package com.zhaoqin.shopsystem.mapper;

import com.zhaoqin.shopcommon.entity.User;
import org.apache.ibatis.annotations.Mapper;

/**
 * @ClassName UserMapper
 * @Author zhaoqin
 * @Date 2020/3/4
 */
@Mapper
public interface UserMapper {

    User queryUser(String username, String password);
}
