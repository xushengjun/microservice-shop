package com.zhaoqin.shopweb;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @ClassName StaticWebConfigureAdapter
 * @Author 兰双阳
 * @Date 2020/1/6 10:15
 */
@Configuration
@Primary
public class StaticWebConfigureAdapter implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        //配置静态资源处理
        registry.addResourceHandler("static/**")
                .addResourceLocations("classpath:/static/");
    }
}
