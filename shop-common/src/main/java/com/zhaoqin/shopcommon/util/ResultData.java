package com.zhaoqin.shopcommon.util;

/**
 * @ClassName ResultData
 * @Author zhaoqin
 * @Date 2020-02-22
 */
public class ResultData<T> {
	private String msg;
	private T data;
	private boolean success;
	private int code;

	public boolean isSuccess() { return success; }

	public void setSuccess(boolean success) { this.success = success; }

	public int getCode() { return code; }

	public void setCode(int code) { this.code = code; }

	public String getMsg() { return msg; }

	public void setMsg(String msg) { this.msg = msg; }

	public T getData() { return data; }

	public void setData(T data) { this.data = data; }

	/** 构造方法 **/
	public ResultData(){}

	public ResultData(
			T data,
			boolean isSuccess,
			String msg,
			int code
	){
		ResultData resultData = new ResultData();
		resultData.setCode(code);
		resultData.setData(data);
		resultData.setMsg(msg);
		resultData.setSuccess(isSuccess);
	}

	/** 返回 成功 失败 自定义 **/
	public static ResultData ok(){
		ResultData resultData = new ResultData();
		resultData.setSuccess(true);
		return resultData;
	}

	public static ResultData ok(Object data, String msg){
		ResultData resultData = new ResultData();
		resultData.data = data;
		resultData.setSuccess(true);
		resultData.setMsg(msg);
		return resultData;
	}

	public static ResultData error(String msg){
		ResultData resultData = new ResultData();
		resultData.setSuccess(false);
		resultData.setMsg(msg);
		return resultData;
	}

	public static ResultData error(Object data, String msg){
		ResultData resultData = new ResultData();
		resultData.data = data;
		resultData.setSuccess(false);
		resultData.setMsg(msg);
		return resultData;
	}



}
