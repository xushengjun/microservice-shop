package com.zhaoqin.shopcommon.锁;

import java.util.concurrent.locks.ReentrantLock;

/**
 * @ClassName Demo2
 * @Author zhaoqin
 * @Date 2020/3/14
 */
public class Demo2 {

    public static void main(String[] args) {

        ReentrantLock reentrantLock = new ReentrantLock();
        reentrantLock.lock();
    }
}
