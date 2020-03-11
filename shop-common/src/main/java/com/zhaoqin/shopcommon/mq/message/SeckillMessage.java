package com.zhaoqin.shopcommon.mq.message;

import com.zhaoqin.shopcommon.entity.User;

/**
 * @ClassName SeckillMessage
 * @Author zhaoqin
 * @Date 2020/3/8
 */
public class SeckillMessage {
    private User user;//用户信息
    private long goodsId;//秒杀商品id
    private String seckillDate;//秒杀时间

    //一定要加
    //原因是我在该实体类中添加了一个为了方便实例化该类用的构造函数，导致JVM不会添加默认的无参构造函数，而jackson的反序列化需要无参构造函数，因此报错。
    public SeckillMessage(){

    }

    public SeckillMessage(User user, long goodsId) {
        this.user = user;
        this.goodsId = goodsId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public long getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(long goodsId) {
        this.goodsId = goodsId;
    }

    public String getSeckillDate() {
        return seckillDate;
    }

    public void setSeckillDate(String seckillDate) {
        this.seckillDate = seckillDate;
    }
}
