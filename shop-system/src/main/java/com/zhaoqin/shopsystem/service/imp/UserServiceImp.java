package com.zhaoqin.shopsystem.service.imp;

import com.zhaoqin.shopcommon.entity.User;
import com.zhaoqin.shopsystem.mapper.UserMapper;
import com.zhaoqin.shopsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @ClassName UserServiceImp
 * @Author zhaoqin
 * @Date 2020/3/4
 */
@Service
public class UserServiceImp implements UserService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public User isExist(String username, String password) {
        return userMapper.queryUser(username, password);
    }
}
