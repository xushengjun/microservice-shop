package com.zhaoqin.shopcommon.entity;

import java.io.Serializable;

public class User implements Serializable {

  private long id;//用户id
  private String userName;//用户姓名
  private String phone;//手机号
  private String password;//密码
  private String salt;//
  private String head;//
  private long loginCount;//登录次数
  private java.sql.Timestamp registerDate;//注册日期
  private java.sql.Timestamp lastLoginDate;//最后一次登录时间


  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }


  public String getUserName() {
    return userName;
  }

  public void setUserName(String userName) {
    this.userName = userName;
  }


  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }


  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }


  public String getSalt() {
    return salt;
  }

  public void setSalt(String salt) {
    this.salt = salt;
  }


  public String getHead() {
    return head;
  }

  public void setHead(String head) {
    this.head = head;
  }


  public long getLoginCount() {
    return loginCount;
  }

  public void setLoginCount(long loginCount) {
    this.loginCount = loginCount;
  }


  public java.sql.Timestamp getRegisterDate() {
    return registerDate;
  }

  public void setRegisterDate(java.sql.Timestamp registerDate) {
    this.registerDate = registerDate;
  }


  public java.sql.Timestamp getLastLoginDate() {
    return lastLoginDate;
  }

  public void setLastLoginDate(java.sql.Timestamp lastLoginDate) {
    this.lastLoginDate = lastLoginDate;
  }

}
