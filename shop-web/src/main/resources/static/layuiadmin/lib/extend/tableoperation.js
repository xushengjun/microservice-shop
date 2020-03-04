/**
 * 
 * @Name：自动加载表格操作
 * @Author：HL
 * 
 */
layui.define([ 'jquery','form','baseUtil'], function(exports) {
	"use strict";

	var $ = layui.$;
	var baseUtil = layui.baseUtil;
	var admin = layui.admin;
	var form = layui.form;

	class TableOperation{
		constructor() {  //constructor 构造方法   
			this.operType = 'view'; 
			this.showData = {};//回显数据，通过showDataUrl获取到的
			this.showDataUrl = ''; 
			this.formLayFilter = 'component-form-group'; 
			this.submitUrl = '';
			this.refreshTableId = 'table-page';
			this.pageEditConfig = '';
		} 
		
		init(){}
		/**
		 * 初始化调用
		 */
		render(){
			var that = this;
			var operType = that.operType + "Show";
			that[operType]();
		}
		/**
		 * 查看页面回显
		 */
		viewShow(){
			var that = this;
			var param = baseUtil.getLayerParentParam();
			var dataUrl = that.showDataUrl;
			
			var _ajaxTypeStr = "POST";
			var _ajaxAsyncFlag = false;
			var _ajaxUrlStr = dataUrl;
			var _ajaxDataObj = param;
			var _ajaxDataTypeStr = "json";
			var _ajaxErrorMsgStr = "数据加载出错";
			baseUtil.ajaxAdmin(_ajaxTypeStr,_ajaxAsyncFlag,_ajaxUrlStr,_ajaxDataObj,_ajaxDataTypeStr,_ajaxErrorMsgStr,function(result){
				if(!baseUtil.isNullOrEmpty(result)){
					if(result.success){
						that.showData = result;
						baseUtil.formVal(that.formLayFilter, result,that.pageEditConfig);
//						form.val(that.formLayFilter, result.obj);
					}else{
						layer.msg(result.msg);
					}
				}else{
					layer.msg("基础调用方法数据加载出错，baseUtil.ajaxAdmin");
				}
			});
		}
		/**
		 * 编辑页面数据回显 dataUrl：查看对象详情url params：参数。例如查看对象id
		 * formLayFilter：form表单lay-filter值
		 */
		editShow(){
	    	var that = this;
	    	//加载form表单
			if(baseUtil.isNullOrEmpty(this.formLayFilter)){
				console.log('表单lay-filter不能为空');
			}
			form.render(null, that.formLayFilter);
			//加载表单提交事件
			that.formSubmit();
			//数据回显
			var param = baseUtil.getLayerParentParam();
			var dataUrl = that.showDataUrl;
			
			var _ajaxTypeStr = "POST";
			var _ajaxAsyncFlag = false;
			var _ajaxUrlStr = dataUrl;
			var _ajaxDataObj = param;
			var _ajaxDataTypeStr = "json";
			var _ajaxErrorMsgStr = "数据加载出错";
			baseUtil.ajaxAdmin(_ajaxTypeStr,_ajaxAsyncFlag,_ajaxUrlStr,_ajaxDataObj,_ajaxDataTypeStr,_ajaxErrorMsgStr,function(result){
				if(!baseUtil.isNullOrEmpty(result)){
					if(result.success){
						that.showData = result;
						baseUtil.formVal(that.formLayFilter, result,that.pageEditConfig);
//						form.val(that.formLayFilter, result.obj);
					}else{
						layer.msg(result.msg);
					}
				}else{
					layer.msg("基础调用方法数据加载出错，baseUtil.ajaxAdmin");
				}
			});
		}
		
		 /**
		 * 编辑页面数据回显 dataUrl：查看对象详情url params：参数。例如查看对象id
		 * formLayFilter：form表单lay-filter值
		 */
		addShow(){
	    	var that = this;
	    	//加载form表单
			if(baseUtil.isNullOrEmpty(that.formLayFilter)){
				console.log('表单lay-filter不能为空');
			}
			form.render(null, that.formLayFilter);
			//加载表单提交事件
			that.formSubmit();
		}
		
		 /**
		 * 工具条显示项
		 * formLayFilter：form表单lay-filter值
		 */
		showShow(){
			var that = this;
	    	//加载form表单
			if(baseUtil.isNullOrEmpty(this.formLayFilter)){
				console.log('表单lay-filter不能为空');
			}
			form.render(null, that.formLayFilter);
			//加载表单提交事件
			that.formSubmit();
		}
		
		/**
		 * 工具条搜索结果排序
		 * formLayFilter：form表单lay-filter值
		 */
		sortShow(){
			var that = this;
	    	//加载form表单
			if(baseUtil.isNullOrEmpty(this.formLayFilter)){
				console.log('表单lay-filter不能为空');
			}
			form.render(null, that.formLayFilter);
			//加载表单提交事件
			that.formSubmit();
		}
		
		/**
		 * 工具条查询条件设置
		 * formLayFilter：form表单lay-filter值
		 */
		searchShow(){
			var that = this;
	    	//加载form表单
			if(baseUtil.isNullOrEmpty(this.formLayFilter)){
				console.log('表单lay-filter不能为空');
			}
			form.render(null, that.formLayFilter);
			//加载表单提交事件
			that.formSubmit();
		}
		
		/**
		 * 提交表单，成功关闭弹窗
		 */
		formSubmit(){
	    	var that = this;
	    	baseUtil.formSubmit(that.submitUrl);
		}
	}
	
	var tableoperation = new TableOperation();
	exports("tableoperation", tableoperation);
});
