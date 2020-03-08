package com.zhaoqin.shopcommon.util;

/**
 * 基础工具类
 * @ClassName CommonUtils
 * @Author zhaoqin
 * @Date 2020/3/7
 */
public class CommonUtils {

    /**
     * 将null转化为空字符串
     * @return
     */
    public static String nullToEmpty(String value){
        if(value == null || value == "")
            return "";
        return "not";
    }

    /**
     *判断字符串是否是空 或 null
     * @param value
     * @return
     */
    public static boolean isEmpty(String value){
        if("".equals(nullToEmpty(value)))
            return true;
        return false;
    }
}
