package com.zhaoqin.shopsystem.service;

import com.zhaoqin.shopcommon.entity.User;
import org.springframework.stereotype.Service;

/**
 * @ClassName UserService
 * @Author zhaoqin
 * @Date 2020/3/4
 */
@Service
public interface UserService {
    User isExist(String username, String password);
}
