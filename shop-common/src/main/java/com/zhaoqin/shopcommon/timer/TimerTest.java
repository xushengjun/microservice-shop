package com.zhaoqin.shopcommon.timer;

import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class TimerTest {

    public static void main(String[] args) {
        threadPoolTimer();
    }

    /**
     * timer demo
     * java定时任务
     */
    public void timer (){
        //需要执行的任务
        TimerTask timerTask = new TimerTask() {
            @Override
            public void run() {
                System.out.println(" 延迟1秒,间隔3秒");
            }
        };

        //创建定时任务
        Timer time = new Timer();
        long delay = 1000;
        long intevalTime = 3000;

        time.scheduleAtFixedRate(timerTask, delay, intevalTime);
    }

    /**
     * 多线程定时任务
     *
     */
    public static void threadPoolTimer (){
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                System.out.println(Thread.currentThread().getName() + " : 延迟1秒,间隔3秒");
            }
        };
        ScheduledExecutorService service = Executors.newSingleThreadScheduledExecutor();
        service.scheduleAtFixedRate(runnable, 1000L, 3000L, TimeUnit.MILLISECONDS);

    }
}
