package com.zhaoqin.shopsystem.controller;

import com.zhaoqin.shopcommon.constant.BaseConstant;
import com.zhaoqin.shopcommon.constant.RedisConstant;
import com.zhaoqin.shopcommon.entity.User;
import com.zhaoqin.shopcommon.util.CommonUtils;
import com.zhaoqin.shopcommon.util.ResultData;
import com.zhaoqin.shopsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

/**
 * @ClassName UserController
 * @Author zhaoqin
 * @Date 2020/3/4
 */
@RestController
public class UserController {
    @Autowired
    private UserService service;
    @Autowired
    private ValueOperations<String, String> valueOperations;
    @Autowired
    private HashOperations<String, String, User> hashOperations;


    /**
     * 登录
     * @param username
     * @param password
     * @return
     */
    @GetMapping("/user/id")
    public ResultData login(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            HttpSession session
    ){
        //判断用户
        User user = service.isExist(username, password);
        if(user == null)
            return ResultData.error("登录密码错误");

        //用户信息存入redis
        if(!hashOperations.hasKey(RedisConstant.userKey, String.valueOf(user.getId())))
            hashOperations.put(RedisConstant.userKey, String.valueOf(user.getId()), user);

        //用户信息存入session
        if(session.getAttribute(session.getId() + user.getId()) == null)
            session.setAttribute(session.getId() + user.getId(), user);

        //用户ID存入redis
        if(CommonUtils.isEmpty(valueOperations.get(BaseConstant.USER_ID)))
            valueOperations.set(BaseConstant.USER_ID, String.valueOf(user.getId()));

        //用户ID存入Session
        if(session.getAttribute(BaseConstant.USER_ID) == null)
            session.setAttribute(BaseConstant.USER_ID, user.getId());

        return ResultData.ok();
    }

    @RequestMapping("/user/name")
    public String print(){
        System.out.println("dds");
        return "121";
    }

}
