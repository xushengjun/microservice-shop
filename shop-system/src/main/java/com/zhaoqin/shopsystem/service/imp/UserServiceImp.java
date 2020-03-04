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
    public boolean isExist(String username, String password) {
        User user = userMapper.queryUser(username, password);
        return false;
    }
}
