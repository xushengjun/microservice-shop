package com.zhaoqin.shopsystem.controller;

import com.zhaoqin.shopcommon.entity.User;
import com.zhaoqin.shopcommon.util.ResultData;
import com.zhaoqin.shopsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

/**
 * @ClassName UserController
 * @Author zhaoqin
 * @Date 2020/3/4
 */
@Controller
@RestController
public class UserController {
    @Autowired
    private UserService service;

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
        User user = service.isExist(username, password);
        if(user == null)
            return ResultData.error("登录密码错误");

        //用户信息存入redis

        //用户信息存入session
        session.setAttribute("" + user.getId(), user);
        return ResultData.ok();
    }

    @RequestMapping("/user/name")
    public String print(){
        System.out.println("dds");
        return "121";
    }

}
