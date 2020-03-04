package com.zhaoqin.shopcommon.entity;


public class Goods {

  private long id;
  private String goodsName; //商品名称
  private String goodsTitle; //商品标题
  private String goodsImg; //商品图片
  private String goodsDetail; //商品细节
  private double goodsPrice; //商品价格
  private long goodsStock; //商品库存 -1代表没有库存
  private java.sql.Timestamp createDate; //创建时间
  private java.sql.Timestamp updateDate; //更新时间

  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }


  public String getGoodsName() {
    return goodsName;
  }

  public void setGoodsName(String goodsName) {
    this.goodsName = goodsName;
  }


  public String getGoodsTitle() {
    return goodsTitle;
  }

  public void setGoodsTitle(String goodsTitle) {
    this.goodsTitle = goodsTitle;
  }


  public String getGoodsImg() {
    return goodsImg;
  }

  public void setGoodsImg(String goodsImg) {
    this.goodsImg = goodsImg;
  }


  public String getGoodsDetail() {
    return goodsDetail;
  }

  public void setGoodsDetail(String goodsDetail) {
    this.goodsDetail = goodsDetail;
  }


  public double getGoodsPrice() {
    return goodsPrice;
  }

  public void setGoodsPrice(double goodsPrice) {
    this.goodsPrice = goodsPrice;
  }


  public long getGoodsStock() {
    return goodsStock;
  }

  public void setGoodsStock(long goodsStock) {
    this.goodsStock = goodsStock;
  }


  public java.sql.Timestamp getCreateDate() {
    return createDate;
  }

  public void setCreateDate(java.sql.Timestamp createDate) {
    this.createDate = createDate;
  }


  public java.sql.Timestamp getUpdateDate() {
    return updateDate;
  }

  public void setUpdateDate(java.sql.Timestamp updateDate) {
    this.updateDate = updateDate;
  }

}
