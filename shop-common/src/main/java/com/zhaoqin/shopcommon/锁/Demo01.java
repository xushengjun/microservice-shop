package com.zhaoqin.shopcommon.锁;

import org.openjdk.jol.info.ClassLayout;

/**
 * @ClassName Demo
 * @Author zhaoqin
 * @Date 2020/3/14
 */
public class Demo01 {


    public static void main(String[] args) {
        L l = new L();
        //打印对象的内存布局
        String s = ClassLayout.parseInstance(l).toPrintable();
        System.out.println(s);
    }
}
