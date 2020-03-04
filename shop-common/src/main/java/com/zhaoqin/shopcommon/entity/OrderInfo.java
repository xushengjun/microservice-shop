package com.zhaoqin.shopcommon.entity;


public class OrderInfo {

  private long id; //订单id
  private long userId; //用户id
  private long goodsId; //收货地址id
  private long addrId; //收货地址id
  private String goodsName; //商品名称
  private long goodsCount; //购买数量
  private double goodsPrice; //商品价格
  private long orderChannel; //支付通道
  private long status; //'订单状态：0 未支付，1已支付，2 已发货，3 已收货，4 已退款，
  private java.sql.Timestamp createDate; //创建订单时间
  private java.sql.Timestamp payDate; //支付时间


  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }


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


  public long getAddrId() {
    return addrId;
  }

  public void setAddrId(long addrId) {
    this.addrId = addrId;
  }


  public String getGoodsName() {
    return goodsName;
  }

  public void setGoodsName(String goodsName) {
    this.goodsName = goodsName;
  }


  public long getGoodsCount() {
    return goodsCount;
  }

  public void setGoodsCount(long goodsCount) {
    this.goodsCount = goodsCount;
  }


  public double getGoodsPrice() {
    return goodsPrice;
  }

  public void setGoodsPrice(double goodsPrice) {
    this.goodsPrice = goodsPrice;
  }


  public long getOrderChannel() {
    return orderChannel;
  }

  public void setOrderChannel(long orderChannel) {
    this.orderChannel = orderChannel;
  }


  public long getStatus() {
    return status;
  }

  public void setStatus(long status) {
    this.status = status;
  }


  public java.sql.Timestamp getCreateDate() {
    return createDate;
  }

  public void setCreateDate(java.sql.Timestamp createDate) {
    this.createDate = createDate;
  }


  public java.sql.Timestamp getPayDate() {
    return payDate;
  }

  public void setPayDate(java.sql.Timestamp payDate) {
    this.payDate = payDate;
  }

}
