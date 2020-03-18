package com.zhaoqin.shopsystem.service;

import com.zhaoqin.shopcommon.entity.User;
import com.zhaoqin.shopsystem.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @ClassName UserService
 * @Author zhaoqin
 * @Date 2020/3/4
 */
public interface UserService {

    User isExist(String username, String password);
}
