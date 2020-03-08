package com.zhaoqin.shopcommon.mq.message;

/**
 * @ClassName SeckillMessage
 * @Author zhaoqin
 * @Date 2020/3/8
 */
public class SeckillMessage {
    private long userId;//用户id
    private long goodsId;//秒杀商品id
    private String seckillDate;//秒杀时间


    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
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
