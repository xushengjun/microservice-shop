package com.zhaoqin.shopcommon.entity;


public class SeckillGoods {

  private long id;
  private long goodsId;//商品id
  private double seckilPrice;//秒杀价格
  private long stockCount;//秒杀数量
  private java.sql.Timestamp startDate;//秒杀开始时间
  private java.sql.Timestamp endDate;//秒杀结束时间


  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }


  public long getGoodsId() {
    return goodsId;
  }

  public void setGoodsId(long goodsId) {
    this.goodsId = goodsId;
  }


  public double getSeckilPrice() {
    return seckilPrice;
  }

  public void setSeckilPrice(double seckilPrice) {
    this.seckilPrice = seckilPrice;
  }


  public long getStockCount() {
    return stockCount;
  }

  public void setStockCount(long stockCount) {
    this.stockCount = stockCount;
  }


  public java.sql.Timestamp getStartDate() {
    return startDate;
  }

  public void setStartDate(java.sql.Timestamp startDate) {
    this.startDate = startDate;
  }


  public java.sql.Timestamp getEndDate() {
    return endDate;
  }

  public void setEndDate(java.sql.Timestamp endDate) {
    this.endDate = endDate;
  }

}
