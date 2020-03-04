/**
 * 
 * @Name：自动加载表格操作
 * @Author：HL
 * 
 */
layui.define(['jquery', 'form','upload'], function(exports) {
	"use strict";

	Array.prototype.remove = function(dx) {
		if (isNaN(dx) || dx > this.length) {
			return false;
		}
		for (var i = 0, n = 0; i < this.length; i++) {
			if (this[i] != this[dx]) {
				this[n++] = this[i]
			}
		}
		this.length -= 1
	}

	var $ = layui.$;
	var admin = layui.admin;
	var setter = layui.setter;
	var form = layui.form;
	var formSelects = layui.formSelects;
	var upload = layui.upload;
	var _accessToken = layui.data(setter.tableName, {
		key: setter.request.tokenName
	});
	var baseUtil = {};

	/**
	 * js从一个对象数组中根据属性值大小排序
	 * @param true 升序排列,false降序排列,age 为某一属性   例子：array.sort(baseUtil.compare("age",false))
	 */
	baseUtil.compare = function (property,desc) {
		return function (a, b) {
			var value1 = a[property];
			var value2 = b[property];
			if(desc==true){
				// 升序排列
				return value1 - value2;
			}else{
				// 降序排列
				return value2 - value1;
			}
		}
	}
	/**
	 * 获取N个月以后的日期
	 * @param dateStr 日期
	 * @param afternumber 需要的N个月
	 */
	baseUtil.getAfterDate = function (dateStr,afternumber){
		// 若为空,返回值也为空
		if (this.isNullOrEmpty(dateStr)) {
			return "";
		}
	    var d = new Date(dateStr.substring(0,4),dateStr.substring(4,6),dateStr.substring(6,8));
	    // 因为getMonth()获取的月份的值只能在0~11之间所以我们在进行setMonth()之前先给其减一
	    d.setMonth((d.getMonth()-1) + parseInt(afternumber));
	    var yy1 = d.getFullYear();
	    var mm1 = d.getMonth()+1;
	    var dd1 = d.getDate();
	    if (mm1 < 10 ) {
	        mm1 = '0' + mm1;
	    }
	    if (dd1 < 10) {
	      dd1 = '0' + dd1;
	    }
	    return ""+ yy1 + mm1 + dd1;
	}
	
	/**
	 * 禁止鼠标点击事件css
	 *@param val  auto：效果和没有定义pointer-events属性相同，鼠标不会穿透当前层
	 *@param val  none：元素不再是鼠标事件的目标，鼠标不再监听当前层而去监听下面的层中的元素
	 */
	//
	baseUtil.setDocumentDisabled = function(elemidArr,val){ 
		for (var i = 0; i < elemidArr.length; i++) {
			let $dom = $('#'+elemidArr[i]);
			if ($dom.length > 0){
				if ($dom.prop("nodeName")=='SELECT') {
					$('#'+elemidArr[i]).siblings('div').css('pointer-events',val)	////elem为元素id,val为pointer-events的值，auto或者none
				}else{
					$('#'+elemidArr[i]).css('pointer-events',val);
				}
			}
		}

	}

	/**
	 * 获取元素到顶部的距离
	 */
	//
	baseUtil.getElementTop = function(elem) {

		var elemTop = elem.offsetTop; //获得elem元素距相对定位的父元素的top

		elem = elem.offsetParent; //将elem换成起相对定位的父元素

		while (elem != null) { //只要还有相对定位的父元素 

			//获得父元素 距他父元素的top值,累加到结果中

			elemTop += elem.offsetTop;

			//再次将elem换成他相对定位的父元素上;

			elem = elem.offsetParent;

		}

		return elemTop;

	}

	/**
	 * 生成uuid,碰撞率不及1/2^122
	 */
	baseUtil.uuid = function() {
		var d = new Date().getTime();
		var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
		return uuid;
	};
	/**
	 * 继承一个类
	 * 
	 * @param subClass
	 *            子类
	 * @param superClass
	 *            要继承的父类
	 */
	baseUtil.extend = function(subClass, superClass) {
		var func = function() {};
		func.prototype = superClass.prototype;
		subClass.prototype = new func();
		subClass.prototype.constructor = subClass;
		subClass.superClass = superClass.prototype;
		if (superClass.prototype.constructor == Object.prototype.constructor) {
			superClass.prototype.constructor = superClass;
		}
	};

	/**
	 * 判断指定对象是否为函数
	 * 
	 * @param obj
	 *            要判断的对象
	 * @return 返回一个值，该值标识对象是否为函数
	 */
	baseUtil.isFunction = function(obj) {
		return typeof(obj) == "function";
	};

	/**
	 * 判断指定对象是否为空或者空字符串
	 * 
	 * @param obj
	 *            要判断的对象
	 * @return 返回一个值，该值标识对象是否为空或者空字符串
	 */
	baseUtil.isNullOrEmpty = function(obj) {
		return typeof(obj) == "undefined" || obj == null || obj === "";
	};
	/**
	 * 判断指定对象是否为空或者空字符串
	 * 
	 * @param obj
	 *            要判断的对象
	 * @return 返回一个值，该值标识对象是否为空或者空字符串
	 */
	baseUtil.nullToStr = function(obj) {
		if (typeof(obj) == "undefined" || obj == null || obj == "null" || obj == "undefined") {
			return "";
		} else {
			return obj;
		}
	};

	/**
	 * 向弹窗页面内传参（在弹窗内添加隐藏input）。和下面的getLayerParentParam组合使用
	 * 在父页面 layer.open 中的success中使用
	 * layero:弹窗页面
	 * data：需要传递的参数（json格式）{name:zhangsan,sex:1}
	 */
	baseUtil.setLayerParam = function(layero, data) {
		var layerPage = layero.find("iframe").contents().find("#parentparam");
		if (layerPage.length == 0) {
			layerPage = layero.find("iframe").contents().find(".layerCard").parent();
		}

		$.each(data, function(i, val) {

			if (!baseUtil.isNullOrEmpty(val)) {
				layerPage.append("<input id='layerparam_" + i + "' type='hidden' name='layerparam' value='" + val + "'>");
			}
		});
	}


	/**
	 * 在弹窗页面中调用获取
	 * 和上面的setLayerParam组合使用
	 * 获取父页面传过来的参数实体
	 */
	baseUtil.getLayerParentParam = function() {
		var returnObj = {},
			flag = false;
		$("input[name='layerparam']").each(function(j, item) {

			returnObj[item.id.split("_")[1]] = item.value;
			flag = true;
		});
		if (!flag) {
			return "";
		} else {
			return returnObj;
		}
	}

	/**
	 * 向弹窗页面内传多个对象（在弹窗内添加隐藏input）。和下面的getLayerParentParamList组合使用
	 * 在父页面 layer.open 中的success中使用
	 * layero:弹窗页面
	 * data：需要传递的参数（json格式）{name:zhangsan,sex:1}
	 */
	baseUtil.setLayerParamList = function(layero, list) {
		var layerPage = layero.find("iframe").contents().find("#parentparam");
		if (layerPage.length == 0) {
			layerPage = layero.find("iframe").contents().find(".layerCard").parent();
		}
		//将list的长度存进一个隐藏的input里面
		layerPage.append("<input id='layerparam_length_" + list.length + "' type='hidden'>")
		$(list).each(function(index, data) {
			$.each(data, function(i, val) {
				if (!baseUtil.isNullOrEmpty(val)) {
					layerPage.append("<input id='layerparam_" + index + "_" + i + "' type='hidden' name='layerparam' value='" +
						val + "'>");
				}
			});
		});
	}

	/**
	 * 在弹窗页面中调用获取
	 * 和上面的setLayerParamList组合使用
	 * 获取父页面传过来的多个参数实体
	 *
	 */
	baseUtil.getLayerParentParamList = function() {
		var returnObjList = new Array();
		var length = $("input[id^='layerparam_length']")[0].id.split("_")[2];
		var returnObj = null;
		for (var i = 0; i < length; i++) {
			returnObj = {};
			$("input[id^='layerparam_" + i + "']").each(function(index, item) {
				if (item != null) {
					returnObj[item.id.split("_")[2]] = item.value;
				} else {
					throw new Error("EndIterative");
				}
			});
			returnObjList.push(returnObj);
		}
		return returnObjList;
	}

	/**
	 * 深复制指定对象
	 * 
	 * @param obj
	 *            要复制的对象
	 * @return 返回复制后的新对象
	 */
	baseUtil.cloneObject = function(obj) {
		var cloneObj = $.extend(true, {}, obj);
		return cloneObj;
	};

	/**
	 * 深复制一个数组
	 * 
	 * @param arr
	 *            要复制的数组
	 * @return 返回复制后的新数组
	 */
	baseUtil.cloneArray = function(arr) {
		var that = this;
		var cloneArr = $.map(arr, function(obj) {
			return that.cloneObject(obj);
		});
		return cloneArr;
	};
	/**
	 * 删除对象中所有属性
	 * 
	 * @param obj
	 *            要删除属性的对象
	 */
	baseUtil.deleteAllProps = function(obj) {
		if (obj == null) {
			return;
		}
		for (var prop in obj) {
			delete obj[prop];
		}
	};
	/**
	 * 获取选中的单选框的值
	 * 
	 * @param name
	 *            单选框名称
	 * @return 返回选中的单选框的值
	 */
	baseUtil.getCheckedRadioVal = function(name) {
		return $(":radio[name='" + name + "']:checked").val();
	};
	/**
	 * 根据名称与值将单选框选中
	 * 
	 * @param name
	 *            单选框名称
	 * @param value
	 *            单选框的值
	 */
	baseUtil.setRadioChecked = function(name, value) {
		$(":radio[name='" + name + "'][value='" + value + "']").prop("checked",
			true);
	};
	/**
	 * 检查名称是否合法
	 * 
	 * @param str
	 *            要检查的名称字符串
	 * @param text
	 *            用于不合法时提示的信息
	 * @return 返回一个值，该值标识输入字符串是否合法
	 */
	baseUtil.checkNameValid = function(str, text) {
		return baseUtil.checkValid(str, text || "名称");
	};
	/**
	 * 通过正则检查输入字符串是否合法
	 * 
	 * @param nameStr
	 *            要检查的字符串
	 * @param text
	 *            用于不合法时提示的信息
	 * @return 返回一个值，该值标识输入字符串是否合法
	 */
	baseUtil.checkValid = function(nameStr, text) {
		if (!nameStr || "") {
			mui.toast(text + "输入不允许为空。");
			return false;
		}
		var x = eval("/[\\\\/'\"*?%.><=:;()\\[\\]|]/");
		var ret = nameStr.match(x);
		if (ret) {
			if (ret == " ") {
				mui.alert(text +
					"输入中不允许包含非法字符' []()\*?%<>=:;|/\" '，该输入中包含非法字符： 。请更换为合法字符。");
			} else {
				mui.alert(text + "输入中不允许包含非法字符' []()\*?%<>=:;|/\" '，该输入中包含非法字符：" + ret +
					"。请更换为合法字符。");
			}
			return false;
		}
		return true;
	};
	/**
	 * 页面加载单个下拉框的方法
	 * @param selectId 必须 控件id
	 * selectOptionObjs:[{"mxz":"***","mxbh":"***"}{...}]
	 * @param selectOptionObjs 必须 控件对应的选项
	 */
	baseUtil.setSelectDefault = function(selectId, selectOptionObjs) {
		var selectValue = $('#' + selectId).val();
		$('#' + selectId).html("");
		$('#' + selectId).append(new Option("", ""));
		$.each(selectOptionObjs, function(index, item) {
			$('#' + selectId).append(new Option(item.mxz, item.mxbh)); //往下拉菜单里添加元素
		})
		$('#' + selectId).val(selectValue);
	}

	/**
	 * 页面加载单个下拉框的方法
	 * @param selectOptionObjs 必须 控件对应的选项
	 */
	baseUtil.setFormSelect = function(selectOptionObjs) {
		var selectValue = '[';
		$.each(selectOptionObjs, function(index, item) {
			selectValue += "{\"name\": \"" + item.mxz + "\", \"value\": \"" + item.mxbh + "\"}";
			if (index < selectOptionObjs.length - 1) {
				selectValue += ",";
			}
		})
		selectValue += "]";
		return JSON.parse(selectValue);
	}

	/**
	 * 页面下拉框选择的时候调用该方法给下拉框对应的text赋值
	 * @param data 必须 layui整合的下拉框的对象
	 * @param textid 非必须 下拉框对应的textid，用来应对编码和名称不是统一格式的情况，统一格式 XXbm XXmc
	 */
	baseUtil.setSelectText = function(data, textid) {
		//		  console.log(data.elem); //得到select原始DOM对象
		//		  console.log(data.value); //得到被选中的值
		//		  console.log(data.othis); //得到美化后的DOM对象
		var $elem = $(data.elem);
		var elemId = $elem.attr("id");
		var ememMcId = elemId.substring(0, elemId.length - 2) + "mc";
		if (!this.isNullOrEmpty(textid)) {
			ememMcId = textid;
		}
		if (!this.isNullOrEmpty($('#' + ememMcId))) {
			var a =$elem.find("option:selected").text();
			$('#' + ememMcId).val($elem.find("option:selected").text());
		}
	}

	/**
	 * 页面多选下拉框选择的时候调用该方法给下拉框对应的text赋值
	 * @param id 点击select的id
	 * @param vals 当前select已选中的值
	 * @param val 当前select点击的值
	 * @param isAdd 当前操作选中or取消
	 * @param isDisabled 当前选项是否是disabled
	 */
	baseUtil.setFormSelectText = function(id, vals, val, isAdd, isDisabled) {
		var ememMcId = id.substring(0, id.length - 2) + "mc";
		var valArr = new Array();
		for (var i = 0; i < vals.length; i++) {
			valArr.push(vals[i].name);
		}

		if (isAdd && !isDisabled) {
			valArr.push(val.name);
		} else if (!isAdd && !isDisabled) {
			valArr.splice(valArr.indexOf(val.name), 1);
		}

		if (!this.isNullOrEmpty($('#' + ememMcId))) {
			$('#' + ememMcId).val(valArr.join());
		}
	}

	/**
	 * 页面checkbox选择的时候调用该方法给非选择的隐藏框禁用或者放开
	 * @param data 必须 layui整合的checkbox的对象
	 * @param unselectid 非必须 checkbox对应的非选择的隐藏框的id，用来应对编码和名称不是统一格式的情况，统一格式 xx xx_unselect
	 */
	baseUtil.setCheckboxUnselect = function(data, unselectid) {
		console.log(data.elem); //得到checkbox原始DOM对象
		console.log(data.elem.checked); //是否被选中，true或者false
		console.log(data.value); //复选框value值，也可以通过data.elem.value得到
		console.log(data.othis); //得到美化后的DOM对象

		var $elem = $(data.elem);
		var elemId = $elem.attr("id");
		var ememUnselectId = elemId + "_unselect";
		if (!this.isNullOrEmpty(unselectid)) {
			ememUnselectId = unselectid;
		}
		if (!this.isNullOrEmpty($('#' + ememUnselectId))) {
			if ($('#' + ememUnselectId)) {
				$('#' + ememUnselectId).remove();
			}
			if (!$elem.is(':checked')) {
				$elem.parent().append('<input type="hidden" name="' + elemId + '" id="' + ememUnselectId + '" value="" >');
			}
		}
	}
	/**
	 * baseUtil.js 编码表加载的入口,加载编码同时绑定下拉框事件
	 * @param bmbhs bmbhs='bmbh1,bmbh2,bmbh3'
	 * @param elementids elementids='emementid1,elementid2,elementid3';
	 * bmbhs 和 elementids 包含的元素长度得相等，否则返回错误
	 */
	baseUtil.loadSelect = function(elementids, bmbhs, thatForm) {
		var that = this;

		if (that.isNullOrEmpty(bmbhs) || that.isNullOrEmpty(elementids) || that.isNullOrEmpty(thatForm)) {
			console.log("调用加载编码方法时，给定的参数不合法(有一个或者多个参数为空)，停止调用！");
			return;
		}
		var _bmbhArr = bmbhs.split(",");
		var _elementidArr = elementids.split(",");
		if (_bmbhArr.length != _elementidArr.length) {
			console.log("调用加载编码方法时，给定的参数不合法(两个参数包含的元素长度不一致)，停止调用！");
			return;
		}

		for (var i = 0; i < _elementidArr.length; i++) {
			thatForm.on('select(' + _elementidArr[i] + ')', function(data) {
				that.setSelectText(data, "");
			});
		}

		var _ajaxTypeStr = "GET";
		var _ajaxAsyncFlag = false;
		var _ajaxUrlStr = wlBianMaUrl(bmbhs);
		var _ajaxDataObj = {};
		var _ajaxDataTypeStr = "json";
		var _ajaxErrorMsgStr = "加载编码信息出错";
		that.ajaxAdmin(_ajaxTypeStr, _ajaxAsyncFlag, _ajaxUrlStr, _ajaxDataObj, _ajaxDataTypeStr, _ajaxErrorMsgStr,
			function(result) {
				if (!that.isNullOrEmpty(result)) {
					if (result.success) {
						for (var i = 0; i < _elementidArr.length; i++) {
							that.setSelectDefault(_elementidArr[i], result.datas[i]);
						}
						thatForm.render();
					} else {
						layer.msg(result.msg);
					}
				} else {
					layer.msg("基础调用方法数据加载出错，baseUtil.ajaxAdmin");
				}
			});
	}

	/** TODO 多选下拉框
	 * baseUtil.js 编码表加载的入口,加载编码同时绑定多选下拉框事件
	 * @param bmbhs bmbhs='bmbh1,bmbh2,bmbh3'
	 * @param elementids elementids='emementid1,elementid2,elementid3'; ID为xm-select属性值
	 * bmbhs 和 elementids 包含的元素长度得相等，否则返回错误
	 */
	baseUtil.loadFormSelects = function(elementids, bmbhs, thatFormSelects) {
		var that = this;

		if (that.isNullOrEmpty(bmbhs) || that.isNullOrEmpty(elementids) || that.isNullOrEmpty(thatFormSelects)) {
			console.log("调用加载编码方法时，给定的参数不合法(有一个或者多个参数为空)，停止调用！");
			return;
		}
		var _bmbhArr = bmbhs.split(",");
		var _elementidArr = elementids.split(",");
		if (_bmbhArr.length != _elementidArr.length) {
			console.log("调用加载编码方法时，给定的参数不合法(两个参数包含的元素长度不一致)，停止调用！");
			return;
		}

		for (var i = 0; i < _elementidArr.length; i++) {
			thatFormSelects.on(_elementidArr[i], function(id, vals, val, isAdd, isDisabled) {
				that.setFormSelectText(id, vals, val, isAdd, isDisabled);
			});
		}

		var setFormSelectArr = null;
		var _ajaxTypeStr = "GET";
		var _ajaxAsyncFlag = false;
		var _ajaxUrlStr = wlBianMaUrl(bmbhs);
		var _ajaxDataObj = {};
		var _ajaxDataTypeStr = "json";
		var _ajaxErrorMsgStr = "加载编码信息出错";
		that.ajaxAdmin(_ajaxTypeStr, _ajaxAsyncFlag, _ajaxUrlStr, _ajaxDataObj, _ajaxDataTypeStr, _ajaxErrorMsgStr,
			function(result) {
				if (!that.isNullOrEmpty(result)) {
					if (result.success) {
						// 初始化多选下拉框
						thatFormSelects.render();
						for (var i = 0; i < _elementidArr.length; i++) {
							setFormSelectArr = that.setFormSelect(result.datas[i]);
							// 加载多选下拉框
							thatFormSelects.data(_elementidArr[i], 'local', {
								arr: setFormSelectArr
							});
							// 设置工具栏显示
							thatFormSelects.btns(_elementidArr[i], ['select', 'remove'], {
								space: '5px'
							});
						}
					} else {
						layer.msg(result.msg);
					}
				} else {
					layer.msg("基础调用方法数据加载出错，baseUtil.ajaxAdmin");
				}
			});
	}
	/**
	 * baseUtil.js 通过ssbmbh和ssmxbh加载对应的下级选择框
	 * @param elementid 当前加载的doc对象
	 * @param bmbh 当前加载的编码
	 * @param ssbmbh 上级编码编号
	 * @param mxbh 当前加载的明细编号
	 * @param ssmxbh 上级明细编号
	 */
	baseUtil.loadSelectBySsbmbhAndSsmxbh = function(elementid, bmbh, ssbmbh, mxbh, ssmxbh, thatForm) {
		var that = this;
		if (that.isNullOrEmpty(elementid) || that.isNullOrEmpty(bmbh) ||
			that.isNullOrEmpty(ssbmbh) || that.isNullOrEmpty(ssmxbh) ||
			that.isNullOrEmpty(thatForm)) {
			console.log("调用加载编码方法时，给定的参数不合法(有一个或者多个参数为空)，停止调用！");
			return;
		}
		var _ajaxTypeStr = "GET";
		var _ajaxAsyncFlag = false;
		var _ajaxUrlStr = wlBianMaUrl(bmbh);
		var _ajaxDataObj = {};
		var _ajaxDataTypeStr = "json";
		var _ajaxErrorMsgStr = "加载编码信息出错";
		that.ajaxAdmin(_ajaxTypeStr, _ajaxAsyncFlag, _ajaxUrlStr, _ajaxDataObj, _ajaxDataTypeStr, _ajaxErrorMsgStr,
			function(result) {
				if (!that.isNullOrEmpty(result)) {
					if (result.success) {
						var selectOptionObjs = result.datas[0];
						for (var i = selectOptionObjs.length - 1; i >= 0; i--) {
							var item = selectOptionObjs[i];
							if (item.ssbmbh != ssbmbh || item.ssmxbh != ssmxbh) {
								selectOptionObjs.remove(i);
							}
						}
						that.setSelectDefault(elementid, selectOptionObjs);
						thatForm.render();
						if (!that.isNullOrEmpty(mxbh)) {
							$('#' + elementid).val(mxbh);
						}
					} else {
						layer.msg(result.msg);
					}
				} else {
					layer.msg("基础调用方法数据加载出错，baseUtil.ajaxAdmin");
				}
			});
	}
	/**
	 * baseUtil.js 给自动以的checkbox 绑定上选中 不选中事件
	 * @param elementids elementids='emementid1,elementid2,elementid3';
	 * @param types types='type1,type2,type3';
	 * @param formats formats='hm,elementid2,elementid3';
	 * bmbhs 和 elementids 包含的元素长度得相等，否则返回错误
	 */
	baseUtil.loadDate = function(elementids, types, formats, thatLayDate) {
		var _elementidArr = elementids.split(',');
		var _typeArr = types.split(',');
		var _formatArr = formats.split(',');
		for (var i = 0; i < _elementidArr.length; i++) {
			thatLayDate.render({
				elem: '#' + _elementidArr[i],
				type: _typeArr[i],
				format: _formatArr[i],
				trigger: 'click'
			});
		}
	}
	/**
	 * baseUtil.js 给自动以的checkbox 绑定上选中 不选中事件;同jsconfig中的事件一个级别，设置表单中checkbox元素使用的
	 */
	baseUtil.loadCheckbox = function(thatForm) {
		var that = this;
		thatForm.on('checkbox(zwebcheckbox1)', function(data) {
			that.setCheckboxUnselect(data, "");
		});
		thatForm.render();
	}
	/**
	 * baseUtil.js 加载页面的时候，给输入框或者textarea加可以输入的最大长度的验证
	 * @param fields 需要加长度验证的字段的集合
	 * @param lengths 需要加长度验证的字段长度的集合
	 */
	baseUtil.checkLength = function(fields, lengths) {
		if (this.isNullOrEmpty(fields) || this.isNullOrEmpty(lengths)) {
			console.log("调用检查长度方法时，给定的参数不合法(有一个或者多个参数为空)，停止调用！");
			return;
		}
		var _fieldArr = fields.split(",");
		var _lengthArr = lengths.split(",");
		if (_fieldArr.length != _lengthArr.length) {
			console.log("调用检查长度方法时，给定的参数不合法(两个参数包含的元素长度不一致)，停止调用！");
			return;
		}
		for (var i = 0; i < _fieldArr.length; i++) {
			var $ele = $("#" + _fieldArr[i]);
			if ($ele.attr("type") == "text" || $ele.is('textarea')) {
				$ele.attr("maxlength", _lengthArr[i]);
				$ele.val($ele.val().substring(0, _lengthArr[i]));
			}
		}
	}
	/**
	 * baseUtil.js ajaxAdmin调用统一入口
	 * @param _ajaxTypeStr ajax提交的方式的字符串 GET,POST
	 * @param _ajaxAsyncFlag ajax提交方法是否同步 true,false  该参数暂时没有用，因为layui后台管理没有控制
	 * @param _ajaxUrlStr ajax提交的url 用户自定义
	 * @param _ajaxDataObj ajax提交的参数 用户自定义 {}
	 * @param _ajaxDataTypeStr ajax返回数据尝试的解析方式 json,text,html
	 * @param _ajaxErrorMsgStr ajax请求失败后的提示
	 * @param _callBackFunc ajax调用以后执行的回调函数
	 * 调用方式
	 * 第一种
	 * baseUtil.ajaxAdmin("POST",true,"www.baidu.com",{},"json","我是加载错误的提示信息",function (result){});
	 * 第二种
	 * var _ajaxTypeStr = "POST";
	 * var _ajaxAsyncFlag = true;
	 * var _ajaxUrlStr = "www.baidu.com";
	 * var _ajaxDataObj = {};
	 * var _ajaxDataTypeStr = "json";
	 * var _ajaxErrorMsgStr = "我是加载错误的提示信息";
	 * baseUtil.ajaxAdmin(_ajaxTypeStr,_ajaxAsyncFlag,_ajaxUrlStr,_ajaxDataObj,_ajaxDataTypeStr,_ajaxErrorMsgStr,function (result){});
	 */
	baseUtil.ajaxAdmin = function(_ajaxTypeStr, _ajaxAsyncFlag, _ajaxUrlStr, _ajaxDataObj, _ajaxDataTypeStr,
		_ajaxErrorMsgStr, _callBackFunc) {
		if (this.isNullOrEmpty(_ajaxTypeStr)) {
			_ajaxTypeStr = "POST";
		}
		if (this.isNullOrEmpty(_ajaxAsyncFlag)) {
			_ajaxAsyncFlag = false; //同步
		}
		if (this.isNullOrEmpty(_ajaxDataObj)) {
			_ajaxDataObj = {};
		}
		if (this.isNullOrEmpty(_ajaxDataTypeStr)) {
			_ajaxDataTypeStr = "json";
		}
		if (this.isNullOrEmpty(_ajaxUrlStr)) {
			layer.msg("ajax请求调用失败，请检查调用设置！");
			return;
		} else {
			_ajaxUrlStr = _ajaxUrlStr + "&_method=" + _ajaxTypeStr;
		}
		if (this.isNullOrEmpty(_ajaxErrorMsgStr)) {
			_ajaxErrorMsgStr = "url=" + urlStr + "对应ajax请求失败，请重试！"; //
		}
		try {
			admin.req({
				type: _ajaxTypeStr,
				async: _ajaxAsyncFlag,
				url: _ajaxUrlStr, //(必需)
				data: _ajaxDataObj, // 参数
				dataType: _ajaxDataTypeStr,
				success: function(result) {
					if (result.code == 1001) { //错误码1表示没有用户信息,应该跳转到登录页面
						layer.msg("没有检测到可用的用户信息，请重新登录");
						location.href = location.origin + '/web'



					} else {
						_callBackFunc(result);
					}
				},
				error: function() {
					layer.msg(_ajaxErrorMsgStr);
				}
			});
		} catch (e) {
			_ajaxUrlStr = _ajaxUrlStr + "&_accessToken=" + _accessToken
			$.ajax({
				type: _ajaxTypeStr,
				async: _ajaxAsyncFlag,
				url: _ajaxUrlStr, //(必需)
				data: _ajaxDataObj, // 参数
				dataType: _ajaxDataTypeStr,
				success: function(result) {
					if (result.code == 1001) { //错误码1表示没有用户信息,应该跳转到登录页面
						layer.msg("没有检测到可用的用户信息，请重新登录");
						location.href = location.origin + '/web'
					} else {
						_callBackFunc(result);
					}
				},
				error: function() {
					layer.msg(_ajaxErrorMsgStr);
				}
			});
		}
	}
	/**
	 * baseUtil.js ajax调用统一入口
	 * @param _ajaxTypeStr ajax提交的方式的字符串 GET,POST
	 * @param _ajaxAsyncFlag ajax提交方法是否同步 true,false  该参数暂时没有用，因为layui后台管理没有控制
	 * @param _ajaxUrlStr ajax提交的url 用户自定义
	 * @param _ajaxDataObj ajax提交的参数 用户自定义 {}
	 * @param _ajaxDataTypeStr ajax返回数据尝试的解析方式 json,text,html
	 * @param _ajaxErrorMsgStr ajax请求失败后的提示
	 * @param _callBackFunc ajax调用以后执行的回调函数
	 * 调用方式
	 * 第一种
	 * baseUtil.ajax("POST",true,"www.baidu.com",{},"json","我是加载错误的提示信息");
	 * 第二种
	 * var _ajaxTypeStr = "POST";
	 * var _ajaxAsyncFlag = true;
	 * var _ajaxUrlStr = "www.baidu.com";
	 * var _ajaxDataObj = {};
	 * var _ajaxDataTypeStr = "json";
	 * var _ajaxErrorMsgStr = "我是加载错误的提示信息";
	 * baseUtil.ajax(_ajaxTypeStr,_ajaxAsyncFlag,_ajaxUrlStr,_ajaxDataObj,_ajaxDataTypeStr,_ajaxErrorMsgStr);
	 */
	baseUtil.ajax = function(_ajaxTypeStr, _ajaxAsyncFlag, _ajaxUrlStr, _ajaxDataObj, _ajaxDataTypeStr, _ajaxErrorMsgStr,
		_callBackFunc,submitBtn) {
		if (this.isNullOrEmpty(_ajaxTypeStr)) {
			_ajaxTypeStr = "POST";
		}
		if (this.isNullOrEmpty(_ajaxAsyncFlag)) {
			_ajaxAsyncFlag = false; //同步
		}
		if (this.isNullOrEmpty(_ajaxDataObj)) {
			_ajaxDataObj = {};
		}
		if (this.isNullOrEmpty(_ajaxDataTypeStr)) {
			_ajaxDataTypeStr = "json";
		}
		if (this.isNullOrEmpty(_ajaxUrlStr)) {
			layer.msg("ajax请求调用失败，请检查调用设置！");
			return;
		} else {
			_ajaxUrlStr = _ajaxUrlStr ;
		}
		if (this.isNullOrEmpty(_ajaxErrorMsgStr)) {
			_ajaxErrorMsgStr = "ulr=" + _ajaxUrlStr + "对应ajax请求失败，请重试！"; //
		}

		var returnObj;
		$.ajax({
			type: _ajaxTypeStr,
			async: _ajaxAsyncFlag,
			url: _ajaxUrlStr, //(必需)
			data: _ajaxDataObj, // 参数
			dataType: _ajaxDataTypeStr,
			success: function(result) {
				if(result.success){
					returnObj = result.data;
				}
				if (baseUtil.isFunction(_callBackFunc)) {
					_callBackFunc(result);
				}
				return returnObj;
			},
			beforeSend :function(){
				if(submitBtn){
					if(!baseUtil.isNullOrEmpty(submitBtn.attr('disabled'))){
						layer.msg('请不要重复提交')
						return false
					}
				}
				if(submitBtn){
					submitBtn.attr('disabled',true)
				}
			},
			complete :function(){
				if(submitBtn){
					submitBtn.attr('disabled',false)
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				let responseJSON = XMLHttpRequest.responseJSON
				switch (responseJSON.status){
					case(500):;
						layer.msg("服务器系统内部错误");
						break;
					case(403):
						layer.alert('检测到您没有登录，请重新登录', function(index){
							location.href = location.origin + '/static/login.html'
						});
						break;
					case(504):
						layer.msg("请求超时");
						break;
					default:
						layer.msg("未知错误");
				}

			}
		});

	}

	/**
	 * 扩展数组方法，在指定位置插入对象
	 * 
	 * @param index
	 *            要插入的索引位置
	 * @param item
	 *            要插入的对象
	 */
	Array.prototype.insert = function(index, item) {
		this.splice(index, 0, item);
	};
	/**
	 * 扩展字符串方法，判断是否以指定字符串结尾
	 * 
	 * @param s
	 *            字符串结尾
	 */
	String.prototype.endWith = function(s) {
		if (s == null || s == "" || this.length == 0 || s.length > this.length) {
			return false;
		}
		if (this.substring(this.length - s.length) == s) {
			return true;
		} else {
			return false;
		}
		return true;
	};
	/**
	 * 扩展字符串方法，判断是否以指定字符串开头
	 * 
	 * @param s
	 *            字符串开头
	 */
	String.prototype.startWith = function(s) {
		if (s == null || s == "" || this.length == 0 || s.length > this.length) {
			return false;
		}
		if (this.substr(0, s.length) == s) {
			return true;
		} else {
			return false;
		}
		return true;
	};

	/**************************************file upload util*********************************************/
	//参考样例  https://www.layui.com/demo/upload.html
	//参考文档  https://www.layui.com/doc/modules/upload.html 
	/*
	<div class="layui-upload">
	  <button type="button" class="layui-btn layui-btn-normal" id="fileListSelect">选择多文件</button> 
	  <button type="button" class="layui-btn" id="fileListSubmit">开始上传</button>
	  <input type="hidden" id="fileList_auto" value="false">
	  <input type="hidden" id="fileList_number" value="2">
	  <div class="layui-upload-list">
	    <table class="layui-table">
	      <thead>
	        <tr><th>文件名</th>
	        <th>大小</th>
	        <th>状态</th>
	        <th>操作</th>
	      </tr></thead>
	      <tbody id="fileList"></tbody>
	    </table>
	  </div>
	</div>
	*/
	/**
	 *  上传pdf
	 *  eleid:页面点击上传按钮的id
	 *  URL:文件上传请求Url。例如：var url = wlFileUploadUrl('yjs_xw_sqxwyjsxx_pslwdzbzdz',baseUtil.uuid());
	 *  upload:Layui的上传文件模块
	 *  filetype：上传文件类型：例如：yjs_xw_sqxwyjsxx_pslwdzbzdz
	 */
	baseUtil.uploadPdf = function(eleid,URL,upload,filetype){
		upload.render({
		    elem: "#"+eleid,//绑定元素
			exts:'pdf',
		    url: URL, //上传接口
			accept: 'file',
		    done: function(res){
		      //上传完毕回调
		      $("#"+eleid).text('已上传')
		      $("#"+eleid).siblings('input.hide').val(res.obj.refid)
		      $("#"+eleid).siblings('a').text(res.obj.orgfilename)
		      $("#"+eleid).siblings('a').attr('href',wlFileDownByFileidUrl(res.obj.fileid))
		    },
		    error: function(){
		      //请求异常回调
		    	layer.msg("上传失败，请重新上传");
		    }
		  });
		//根据refid去获取fileid回显
		var refidVal = $("#"+eleid).siblings('input.hide').val();
		if(refidVal != null && refidVal != ""){
		    $("#"+eleid).text('已上传');
			var _ajaxUrlStr = wlFileByFiletypeAndRefidUrl(filetype, refidVal);
			baseUtil.ajax("GET", true, _ajaxUrlStr, null, "json", null,function(result) {
				if (!baseUtil.isNullOrEmpty(result)) {
					if (result.success && !baseUtil.isNullOrEmpty(result.obj)) {
						$("#"+eleid).siblings('a').text(result.obj[0].orgfilename);
						$("#"+eleid).siblings('a').attr('href',wlFileDownByFileidUrl(result.obj[0].fileid));
					}
				}
			});
		}
		
	}
	/**
	 * 参照layui.upload.js源文件,还有一些参数没有配置，如果有需要可以在下面的方法添加进去
	 */
	baseUtil.fileListUpload = function(_refid, _reftype, thatupload) {
		if (this.isNullOrEmpty($('#' + _refid).val())) {
			$('#' + _refid).val(baseUtil.uuid());
		}
		var uploadListIns = thatupload.render({
			elem: '#' + _refid + 'Select',

			data: function() {
				if ($('#' + _refid + '_data') && $('#' + _refid + '_data').val()) {
					return $('#' + _refid + '_data').val(); //可能需要处理为json对象
				} else {
					return {};
				}
			}(),
			size: function() {
				if ($('#' + _refid + '_size') && $('#' + _refid + '_size').val()) {
					return parseInt($('#' + _refid + '_size').val());
				} else {
					return 0;
				}
			}(), //文件大小
			number: function() {
				if ($('#' + _refid + '_number') && $('#' + _refid + '_number').val()) {
					return parseInt($('#' + _refid + '_number').val());
				} else {
					return 0;
				}
			}(), //允许同时上传的文件数，默认不限制
			url: function() {
				if ($('#' + _refid + '_url') && $('#' + _refid + '_url').val()) {
					return $('#' + _refid + '_url').val();
				} else {
					console.log("上传_reftype=" + _reftype);
					console.log("上传_refid=" + $('#' + _refid).val());
					if ($('#' + _refid) && $('#' + _refid).val() && _reftype) {
						var scurl = wlFileUploadUrl(_reftype, $('#' + _refid).val());
						console.log("上传url=" + scurl);
						return scurl;
					} else {
						console.log('没有可用的上传服务，请检查配置文件！');
						return '';
					}
				}
			}(),
			accept: function() {
				if ($('#' + _refid + '_accept') && $('#' + _refid + '_accept').val()) {
					return $('#' + _refid + '_accept').val();
				} else {
					return 'file';
				}
			}(),
			exts: function() {
				if ($('#' + _refid + '_exts') && $('#' + _refid + '_exts').val()) {
					return $('#' + _refid + '_exts').val();
				} else {
					return ''; //jpg|png|gif|bmp|jpeg|zip|rar|7z
				}
			}(),
			multiple: function() {
				if ($('#' + _refid + '_number') && $('#' + _refid + '_number').val()) {
					return parseInt($('#' + _refid + '_number').val()) > 1 ? true : false;
				} else {
					return true;
				}
			}(),
			auto: function() {
				if ($('#' + _refid + '_auto') && $('#' + _refid + '_auto').val() && ($('#' + _refid + '_auto').val() ==
						'false')) {
					return false;
				} else {
					return true;
				}
			}(),
			bindAction: '#' + _refid + 'Submit',
			choose: function(obj) {
				var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
				//读取本地文件
				obj.preview(function(index, file, result) {
					var $tr = $(['<tr id="upload-' + index + '">',
						'	<td>' + file.name + '</td>',
						'	<td>' + (file.size / 1014).toFixed(1) + 'kb</td>',
						'	<td>等待上传</td>',
						'	<td>',
						'		<button type="button" class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>',
						'		<button type="button" class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>',
						'	</td>',
						'</tr>'
					].join(''));
					//单个重传
					$tr.find('.demo-reload').on('click', function() {
						obj.upload(index, file);
					});
					//删除
					$tr.find('.demo-delete').on('click', function() {
						delete files[index]; //删除对应的文件
						$tr.remove();
					});
					uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选 没看明白，但是不能少
					$('#' + _refid + '_docid').append($tr);
				});
			},
			done: function(res, index, upload) {
				if (res.code == 0) { //上传成功
					var tr = $('#' + _refid + '_docid').find('tr#upload-' + index);
					var tds = tr.children();
					tds.eq(0).html('<a style="text-decoration:underline" href=' + wlFileDownByFileidUrl(res.obj.fileid) + '>' +
						tds.eq(0).html() + '</a>');
					tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
					tds.eq(3).find('.demo-reload').remove(); //清空操作
					//重新绑定删除事件
					tds.eq(3).find('.demo-delete').unbind('click').on('click', function() {
						var $that = $(this);
						layer.confirm('删除后不能找回，点击确定删除！', {
							btn: ['确定', '取消']
						}, function(index) {
							$.ajax({
								type: "POST",
								async: false,
								url: wlFileDeleteByFileidUrl(res.obj.fileid), //(必需) 取res中的fileid
								data: {}, // 参数
								dataType: "html",
								success: function(result) {
									if (result.code == 1001) { //错误码1表示没有用户信息,应该跳转到登录页面
										layer.msg("没有检测到可用的用户信息，请重新登录");
										location.href = location.origin + '/web'
									} else {
										layer.msg("删除成功");
										$that.parent().parent().remove();
									}
								},
								error: function() {
									layer.msg("删除失败");
								}
							});
							layer.close(index);
						});
					});
					return delete this.files[index]; //删除文件队列已经上传成功的文件
				}
				//this.error(index, upload);
			},
			error: function(index, upload) {
				var tr = $('#' + _refid + '_docid').find('tr#upload-' + index);
				var tds = tr.children();
				tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
				tds.eq(3).find('.demo-delete').trigger('click'); //删除
				return delete this.files[index]; //删除文件队列已经上传成功的文件
			}
		})
	}
	/**
	 * 加载附件列表
	 */
	baseUtil.fileListLoad = function(_refid, _reftype, thatupload) {
		var _ajaxTypeStr = "GET";
		var _ajaxAsyncFlag = false;
		var _ajaxUrlStr = wlFileByFiletypeAndRefidUrl(_reftype, $('#' + _refid).val());
		var _ajaxDataObj = {};
		var _ajaxDataTypeStr = "json";
		var _ajaxErrorMsgStr = "加载用户头像信息出错";
		baseUtil.ajaxAdmin(_ajaxTypeStr, _ajaxAsyncFlag, _ajaxUrlStr, _ajaxDataObj, _ajaxDataTypeStr, _ajaxErrorMsgStr,
			function(result) {
				if (!baseUtil.isNullOrEmpty(result)) {
					if (result.success && !baseUtil.isNullOrEmpty(result.obj)) {
						for (var i = 0; i < result.obj.length; i++) {
							var resultObj = result.obj[i];
							if (result.obj[i].sign == 'del') {
								continue;
							}
							var trStr = '';
							trStr += '<tr id="' + resultObj.fileid + '">';
							trStr += '<td><a style="text-decoration:underline" href=' + wlFileDownByFileidUrl(resultObj.fileid) + '>' +
								resultObj.orgfilename + '</a></td>';
							trStr += '<td>' + resultObj.filesize + '</td>';
							trStr += '<td>已上传</td>';
							trStr += '<td>';
							trStr += '<button type="button" class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>';
							trStr += '</td>';
							trStr += '</tr>';
							var $trStr = $([trStr].join(''));
							$('#' + _refid + '_docid').append($trStr);
						}
						$('#' + _refid + '_docid tr').each(function(index, tritem) {
							var trfileid = $(this).attr('id');
							$(this).find('.demo-delete').unbind('click').on('click', function() {
								var $that = $(this);
								layer.confirm('删除后不能找回，点击确定删除！', {
									btn: ['确定', '取消']
								}, function(index) {
									$.ajax({
										type: "POST",
										async: false,
										url: wlFileDeleteByFileidUrl(trfileid), //(必需) 取res中的fileid
										data: {}, // 参数
										dataType: "html",
										success: function(result) {
											if (result.code == 1001) { //错误码1表示没有用户信息,应该跳转到登录页面
												layer.msg("没有检测到可用的用户信息，请重新登录");
												location.href = location.origin + '/web'
												//location.href=location.origin +'/web/view/sys/user/login.html'
											} else {
												layer.msg("删除成功");
												$that.parent().parent().remove();
											}
										},
										error: function() {
											layer.msg("删除失败");
										}
									});
									layer.close(index);
								});
							});
						});
					} else {
						//layer.msg(result.msg);
					}
				} else {
					layer.msg("基础调用方法数据加载出错，baseUtil.fileListLoad");
				}
			});
	}

	/*
	<div class="layui-upload">
	  <input type="hidden" id="test1_url" value="www.2.com">
	  <div class="layui-upload-list">
	    <img class="layui-upload-img" id="test1">
	    <p id="demoText"></p>
	  </div>
	</div>   
	 */
	/**
	 * 单个图片点击文件上传
	 */
	baseUtil.imageUpload = function(_refid, _reftype, thatupload) {
		if (this.isNullOrEmpty($('#' + _refid).val())) {
			$('#' + _refid).val(baseUtil.uuid());
		}
		var uploadInst = thatupload.render({
			elem: '#' + _refid + '_docid',
			url: function() {
				if ($('#' + _refid + '_url') && $('#' + _refid + '_url').val()) {
					return $('#' + _refid + '_url').val();
				} else {
					console.log("上传_reftype=" + _reftype);
					console.log("上传_refid=" + $('#' + _refid).val());
					if ($('#' + _refid) && $('#' + _refid).val() && _reftype) {
						var scurl = wlFileUploadUrl(_reftype, $('#' + _refid).val(), 'delete');
						console.log("上传url=" + scurl);
						return scurl;
					} else {
						console.log('没有可用的上传服务，请检查配置文件！');
						return '';
					}
				}
			}(),
			before: function(obj) {
				//预读本地文件示例，不支持ie8
				obj.preview(function(index, file, result) {
					$('#' + _refid + '_docid').attr('src', result); //图片链接（base64）
				});
			},
			done: function(res) {
				//如果上传失败
				if (res.code > 0) {
					return layer.msg('上传失败');
				}
				//上传成功
				layer.msg('上传成功');
			},
			error: function() {
				//演示失败状态，并实现重传
				var demoText = $('#demoText');
				demoText.html(
					'<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
				demoText.find('.demo-reload').on('click', function() {
					uploadInst.upload();
				});
			}
		});
	}
	/**
	 * 加载图片附件
	 */
	baseUtil.imageLoad = function(_refid, _reftype, thatupload) {
		var _ajaxTypeStr = "POST";
		var _ajaxAsyncFlag = false;
		var _ajaxUrlStr = wlFileByFiletypeAndRefidUrl(_reftype, $('#' + _refid).val());
		var _ajaxDataObj = {};
		var _ajaxDataTypeStr = "json";
		var _ajaxErrorMsgStr = "加载图片信息出错";
		baseUtil.ajaxAdmin(_ajaxTypeStr, _ajaxAsyncFlag, _ajaxUrlStr, _ajaxDataObj, _ajaxDataTypeStr, _ajaxErrorMsgStr,
			function(result) {
				if (!baseUtil.isNullOrEmpty(result)) {
					if (result.success && !baseUtil.isNullOrEmpty(result.obj)) {
						$('#' + _refid + '_docid').attr("src", wlFileViewByFileidUrl(result.obj[0].fileid));
					} else {
						//layer.msg(result.msg);
					}
				} else {
					layer.msg("基础调用方法数据加载出错，baseUtil.ajaxAdmin");
				}
			});
	}

	/**
	 * 加载PDF附件
	 */
	baseUtil.pdfLoad = function(_refid, _reftype, thatupload) {
		var pdf
		var _ajaxTypeStr = "POST";
		var _ajaxAsyncFlag = false;
		var _ajaxUrlStr = wlFileByFiletypeAndRefidUrl(_reftype, $('#' + _refid).val());
		var _ajaxDataObj = {};
		var _ajaxDataTypeStr = "json";
		var _ajaxErrorMsgStr = "加载图片信息出错";
		baseUtil.ajaxAdmin(_ajaxTypeStr, _ajaxAsyncFlag, _ajaxUrlStr, _ajaxDataObj, _ajaxDataTypeStr, _ajaxErrorMsgStr,
			function(result) {
				if (!baseUtil.isNullOrEmpty(result)) {
					pdf = result.obj[0]
				} else {
					layer.msg("基础调用方法数据加载出错，baseUtil.ajaxAdmin");
				}
			});
		return pdf
	}


	/**
	 * 加载论文附件
	 */
	baseUtil.lwLoad = function(_reftype, val) {
		var pdf
		var _ajaxTypeStr = "POST";
		var _ajaxAsyncFlag = false;
		var _ajaxUrlStr = wlFileByFiletypeAndRefidUrl(_reftype, val);
		var _ajaxDataObj = {};
		var _ajaxDataTypeStr = "json";
		var _ajaxErrorMsgStr = "加载图片信息出错";
		baseUtil.ajaxAdmin(_ajaxTypeStr, _ajaxAsyncFlag, _ajaxUrlStr, _ajaxDataObj, _ajaxDataTypeStr, _ajaxErrorMsgStr,
			function(result) {
				if (!baseUtil.isNullOrEmpty(result.obj)) {
					pdf = result.obj[0]
				} else {
					pdf = ''
					layer.msg("没有找到文件");
				}
			});
		return pdf
	}



	/**
	 * 通过uuid直接加载PDF附件 
	 */
	baseUtil.pdfLoadByuuid = function(_refid, _reftype, thatupload) {
		var pdf
		var _ajaxTypeStr = "POST";
		var _ajaxAsyncFlag = false;
		var _ajaxUrlStr = wlFileByFiletypeAndRefidUrl(_reftype, _refid);
		var _ajaxDataObj = {};
		var _ajaxDataTypeStr = "json";
		var _ajaxErrorMsgStr = "加载图片信息出错";
		baseUtil.ajaxAdmin(_ajaxTypeStr, _ajaxAsyncFlag, _ajaxUrlStr, _ajaxDataObj, _ajaxDataTypeStr, _ajaxErrorMsgStr,
			function(result) {
				if (!baseUtil.isNullOrEmpty(result)) {
					pdf = result.obj[0]
				} else {
					layer.msg("基础调用方法数据加载出错，baseUtil.ajaxAdmin");
				}
			});
		return pdf
	}


	/**
	 * 首页图片logo展示
	 */
	baseUtil.logoLoad = function(id, _refid, _reftype) {
		var _ajaxTypeStr = "POST";
		var _ajaxAsyncFlag = false;
		var _ajaxUrlStr = wlFileByFiletypeAndRefidUrl(_reftype, _refid);
		var _ajaxDataObj = {};
		var _ajaxDataTypeStr = "json";
		var _ajaxErrorMsgStr = "加载图片信息出错";
		baseUtil.ajaxAdmin(_ajaxTypeStr, _ajaxAsyncFlag, _ajaxUrlStr, _ajaxDataObj, _ajaxDataTypeStr, _ajaxErrorMsgStr,
			function(result) {
				if (!baseUtil.isNullOrEmpty(result)) {
					if (result.success && !baseUtil.isNullOrEmpty(result.obj)) {
						$('#' + id + '_logoid').attr("src", wlFileViewByFileidUrl(result.obj[0].fileid));
					} else {
						//layer.msg(result.msg);
					}
				} else {
					layer.msg("基础调用方法数据加载出错，baseUtil.ajaxAdmin");
				}
			});
	}


	/**
	 * 图片展示
	 */
	baseUtil.imgLoad = function(_refid, _reftype) {
		var imgSrc;
		var _ajaxTypeStr = "POST";
		var _ajaxAsyncFlag = false;
		var _ajaxUrlStr = wlFileByFiletypeAndRefidUrl(_reftype, _refid);
		var _ajaxDataObj = {};
		var _ajaxDataTypeStr = "json";
		var _ajaxErrorMsgStr = "加载图片信息出错";
		baseUtil.ajaxAdmin(_ajaxTypeStr, _ajaxAsyncFlag, _ajaxUrlStr, _ajaxDataObj, _ajaxDataTypeStr, _ajaxErrorMsgStr,
			function(result) {
				if (!baseUtil.isNullOrEmpty(result)) {
					if (result.success && !baseUtil.isNullOrEmpty(result.obj)) {
						imgSrc = wlFileViewByFileidUrl(result.obj[0].fileid);
					} else {
						//layer.msg(result.msg);
					}
				} else {
					layer.msg("基础调用方法数据加载出错，baseUtil.ajaxAdmin");
				}
			});
		return imgSrc;
	}
	/**************************************file upload util*********************************************/
	/**
	 * 通过弹开页面加载专业
	 *@param _docid 给父页面上_docid对应的元素绑定点击弹开页面的事件,唯一
	 *@param _contenturl 设置layer.open的页面的url
	 *@param _parentdocids 设置需要给父页面设置值的元素的id的集合 docid1,docid2,docid3
	 *@param _childdocids 设置给父页面设置值的时候，子页面和父页面的对应关系 childdocid1,childdocid2,childdocid3
	 *_parentdocids,_childdocids 通过逗号拆分为数组的时候，两个数组的长度需要一致
	 */
	baseUtil.loadTablezhuanye = function(_docid, _contenturl, _parentdocids, _childdocids, _callBackFunc) {
		if (this.isNullOrEmpty(_contenturl)) {
			_contenturl = wlProtocol + wlHost + wlPort + wlWeb +
				'/view/yjs/yy/dm/gg/bxzydm/bxzydmlist.html';
		} else {
			_contenturl = wlProtocol + wlHost + wlPort + wlWeb + _contenturl;
		}
		if (this.isNullOrEmpty(_parentdocids)) {
			_parentdocids = _docid;
		}
		if (this.isNullOrEmpty(_childdocids)) {
			_childdocids = 'yjsxkzymc';
		}
		this.loadTableByOpen(_docid, _contenturl, _parentdocids, _childdocids, _callBackFunc);
	}

	/**
	 * 通过弹开页面加载学院
	 *@param _docid 给父页面上_docid对应的元素绑定点击弹开页面的事件,唯一
	 *@param _contenturl 设置layer.open的页面的url
	 *@param _parentdocids 设置需要给父页面设置值的元素的id的集合 docid1,docid2,docid3
	 *@param _childdocids 设置给父页面设置值的时候，子页面和父页面的对应关系 childdocid1,childdocid2,childdocid3
	 *_parentdocids,_childdocids 通过逗号拆分为数组的时候，两个数组的长度需要一致
	 */
	baseUtil.loadTablexueyuan = function(_docid, _contenturl, _parentdocids, _childdocids, _callBackFunc) {
		if (this.isNullOrEmpty(_contenturl)) {
			_contenturl = wlProtocol + wlHost + wlPort + wlWeb +
				'/view/template/list.html?modurl=/view/yjs/yy/dm/gg/xndwdm/xndwdmlist.html';
		}
		if (this.isNullOrEmpty(_parentdocids)) {
			_parentdocids = _docid;
		}
		if (this.isNullOrEmpty(_childdocids)) {
			_childdocids = 'dwmc';
		}
		this.loadTableByOpen(_docid, _contenturl, _parentdocids, _childdocids, _callBackFunc);
	}

	/**TODO
	 * 通过弹开页面加载教师信息
	 *@param _docid 给父页面上_docid对应的元素绑定点击弹开页面的事件,唯一
	 *@param _contenturl 设置layer.open的页面的url
	 *@param _parentdocids 设置需要给父页面设置值的元素的id的集合 docid1,docid2,docid3
	 *@param _childdocids 设置给父页面设置值的时候，子页面和父页面的对应关系 childdocid1,childdocid2,childdocid3
	 *_parentdocids,_childdocids 通过逗号拆分为数组的时候，两个数组的长度需要一致
	 *@DBCODE yjs.yy.py.zy.bxjzggl
	 */
	baseUtil.loadTablejiaoshi = function(_docid, _contenturl, _parentdocids, _childdocids, _callBackFunc) {
		if (this.isNullOrEmpty(_contenturl)) {
			_contenturl = wlProtocol + wlHost + wlPort + wlWeb + '/view/yjs/yy/py/zy/bxjzggl/qx/bxjzgglqxlist.html';
		}
		if (this.isNullOrEmpty(_parentdocids)) {
			_parentdocids = _docid;
		}
		if (this.isNullOrEmpty(_childdocids)) {
			_childdocids = 'xm';
		}
		this.loadTableByOpen(_docid, _contenturl, _parentdocids, _childdocids, _callBackFunc);
	}
	/**TODO
	 * 通过弹开页面加载课程名称
	 *@param _docid 给父页面上_docid对应的元素绑定点击弹开页面的事件,唯一
	 *@param _contenturl 设置layer.open的页面的url
	 *@param _parentdocids 设置需要给父页面设置值的元素的id的集合 docid1,docid2,docid3
	 *@param _childdocids 设置给父页面设置值的时候，子页面和父页面的对应关系 childdocid1,childdocid2,childdocid3
	 *_parentdocids,_childdocids 通过逗号拆分为数组的时候，两个数组的长度需要一致
	 *@DBCODE yjs.yy.py.zy.jzggl
	 */
	baseUtil.loadTablekecheng = function(_docid, _contenturl, _parentdocids, _childdocids, _callBackFunc) {
		if (this.isNullOrEmpty(_contenturl)) {
			_contenturl = wlProtocol + wlHost + wlPort + wlWeb + '/view/yjs/yy/py/zy/kcxx/qx/kcxxqxlist.html';
		}
		if (this.isNullOrEmpty(_parentdocids)) {
			_parentdocids = _docid;
		}
		if (this.isNullOrEmpty(_childdocids)) {
			_childdocids = 'kcmc';
		}
		this.loadTableByOpen(_docid, _contenturl, _parentdocids, _childdocids, _callBackFunc);
	}

	/**
	 *baseutil.js 通过layer.open打开子页面 加载表的信息选中后赋值给父页面
	 *@param _docid 给父页面上_docid对应的元素绑定点击弹开页面的事件,唯一
	 *@param _contenturl 设置layer.open的页面的url
	 *@param _parentdocids 设置需要给父页面设置值的元素的id的集合 docid1,docid2,docid3
	 *@param _childdocids 设置给父页面设置值的时候，子页面和父页面的对应关系 childdocid1,childdocid2,childdocid3
	 *_parentdocids,_childdocids 通过逗号拆分为数组的时候，两个数组的长度需要一致
	 */
	baseUtil.loadTableByOpen = function(_docid, _contenturl, _parentdocids, _childdocids, _callBackFunc) {
		if (this.isNullOrEmpty(_docid)) {
			layer.msg("未指定对应的元素，请检查配置文件或者加载逻辑");
			return false;
		}
		if (this.isNullOrEmpty(_contenturl)) {
			layer.msg("未指定打开的内容页面，请检查配置文件或者加载逻辑");
			return false;
		}
		if (this.isNullOrEmpty(_parentdocids)) {
			layer.msg("未指定要设置的父页面元素，请检查配置文件或者加载逻辑");
			return false;
		}
		if (this.isNullOrEmpty(_childdocids)) {
			layer.msg("未指定要取值的子页面元素，请检查配置文件或者加载逻辑");
			return false;
		}
		var _parentdocidArray = _parentdocids.split(",");
		var _childdocidArray = _childdocids.split(",");
		if (_parentdocidArray.length == 0 || _childdocidArray.length == 0 || _parentdocidArray.length != _childdocidArray.length) {
			layer.msg("传入的父页面元素和子页面元素长度不一致，请检查配置文件或者加载逻辑");
			return false;
		}
		$('#' + _docid).bind('click', function() {
			layer.open({
				btnAlign: 'c',
				type: 2,
				title: "添加",
				content: _contenturl,
				maxmin: !0,
				area: admin.screen() < 2 ? ['95%', '95%'] : ['95%', '95%'],
				btn: ["确定", "清空", "取消"],
				yes: function(index, layero) {
					var $checkboxdatas = $(window["layui-layer-iframe" + index].layui.autotable.getCheckedData());
					if (!$checkboxdatas || $checkboxdatas.length == 0) {
						layer.msg("请选择一条信息");
						return false;
					}
					if ($checkboxdatas.length > 1) {
						layer.msg("只能选择一条信息");
						return false;
					}
					for (var i = 0; i < _parentdocidArray.length; i++) {
						$('#' + _parentdocidArray[i]).val($checkboxdatas[0][_childdocidArray[i]]);
					}
					// 回调函数
					if (baseUtil.isFunction(_callBackFunc)) {
						// 选中的数据
						_callBackFunc($checkboxdatas[0]);
					}
					layer.close(index);
				},
				btn2: function(index, layero) {
					for (var i = 0; i < _parentdocidArray.length; i++) {
						$('#' + _parentdocidArray[i]).val('');
						if (baseUtil.isFunction(_callBackFunc)) {
							// 选中的数据
							_callBackFunc({empty:'empty'});
						}
					}
				},
				btn3: function(index, layero) {
					layer.close(index);
				},
				success: function(layero, index) {

				}
			});
		})
	}

	/**
	 * 加载办公室审核人弹框
	 *baseutil.js 通过layer.open打开子页面 加载表的信息选中后赋值给父页面
	 *@param _docid 给父页面上_docid对应的元素绑定点击弹开页面的事件,唯一
	 *@param _contenturl 设置layer.open的页面的url
	 *@param _parentdocids 设置需要给父页面设置值的元素的id的集合 docid1,docid2,docid3
	 *@param _childdocids 设置给父页面设置值的时候，子页面和父页面的对应关系 childdocid1,childdocid2,childdocid3
	 *_parentdocids,_childdocids 通过逗号拆分为数组的时候，两个数组的长度需要一致
	 */
	baseUtil.loadBgsshrTable = function(_docid,_title,_contenturl, _parentdocids, _childdocids, _callBackFunc) {
		if (this.isNullOrEmpty(_docid)) {
			layer.msg("未指定对应的元素，请检查配置文件或者加载逻辑");
			return false;
		}
		if (this.isNullOrEmpty(_contenturl)) {
			layer.msg("未指定打开的内容页面，请检查配置文件或者加载逻辑");
			return false;
		}
		if (this.isNullOrEmpty(_parentdocids)) {
			layer.msg("未指定要设置的父页面元素，请检查配置文件或者加载逻辑");
			return false;
		}
		if (this.isNullOrEmpty(_childdocids)) {
			layer.msg("未指定要取值的子页面元素，请检查配置文件或者加载逻辑");
			return false;
		}
		var _parentdocidArray = _parentdocids.split(",");
		var _childdocidArray = _childdocids.split(",");
		if (_parentdocidArray.length == 0 || _childdocidArray.length == 0 || _parentdocidArray.length != _childdocidArray.length) {
			layer.msg("传入的父页面元素和子页面元素长度不一致，请检查配置文件或者加载逻辑");
			return false;
		}
		$('#' + _docid).bind('click', function() {
			layer.open({
				btnAlign: 'c',
				type: 2,
				title: _title,
				content: _contenturl,
				maxmin: !0,
				area: admin.screen() < 2 ? ['95%', '95%'] : ['95%', '95%'],
				btn: ["确定", "清空", "取消"],
				yes: function(index, layero) {
					var $checkboxdatas = $(window["layui-layer-iframe" + index].layui.autotable.getCheckedData());
					if (!$checkboxdatas || $checkboxdatas.length == 0) {
						layer.msg("请选择一条信息");
						return false;
					}
					if ($checkboxdatas.length > 1) {
						layer.msg("只能选择一条信息!");
						return false;
					}
					for (var i = 0; i < _parentdocidArray.length; i++) {
						$('#' + _parentdocidArray[i]).val($checkboxdatas[0][_childdocidArray[i]]);
					}
					// 回调函数
					if (baseUtil.isFunction(_callBackFunc)) {
						// 选中的数据
						_callBackFunc($checkboxdatas[0]);
					}
					layer.close(index);
				},
				btn2: function(index, layero) {
					for (var i = 0; i < _parentdocidArray.length; i++) {
						$('#' + _parentdocidArray[i]).val('');
						if (baseUtil.isFunction(_callBackFunc)) {
							// 选中的数据
							_callBackFunc({empty:'empty'});
						}
					}
				},
				btn3: function(index, layero) {
					layer.close(index);
				},
				success: function(layero, index) {

				}
			});
		})
	}

	/**
	 * 根据result.jsconfig设置对应元素的信息在render 以前
	 */
	baseUtil.loadResultJsconfigBeforeRender = function(result, laydate, form, formSelects) {
		var that = this;
		if (!that.isNullOrEmpty(result)) { //根据result.jsconfig返回的信息处理不同类型的元素
			if (result.jsconfig) {
				var jsconfig = result.jsconfig;
				if (jsconfig.loadSelect) {
					that.loadSelect(jsconfig.loadSelect.field, jsconfig.loadSelect.selectcode, form);
				}
				if (jsconfig.loadFormselects) {
					that.loadFormSelects(jsconfig.loadFormselects.field, jsconfig.loadFormselects.selectcode, formSelects);
				}
			}
		}
	}
	/**
	 * 根据result.jsconfig设置对应元素的信息在render 以后
	 */
	baseUtil.loadResultJsconfigAfterRender = function(result, laydate, form) {
		var that = this;
		if (!that.isNullOrEmpty(result)) { //根据result.jsconfig返回的信息处理不同类型的元素
			if (result.jsconfig) {
				var jsconfig = result.jsconfig;
				if (jsconfig.loadDate) {
					that.loadDate(jsconfig.loadDate.field, jsconfig.loadDate.datetype, jsconfig.loadDate.dateformat, laydate);
				}
				if (jsconfig.checkLength) {
					that.checkLength(jsconfig.checkLength.field, jsconfig.checkLength.maxlength);
				}
			}
		}
		that.loadCheckbox(form);
	}
	/**
	 * 根据result.modname设置页面title的信息
	 */
	baseUtil.loadResultModname = function(result) {
		var that = this;
		if (result && result.modname) {
			var _modname = result.modname;
			if (!that.isNullOrEmpty(_modname)) {
				$("title").html(_modname + $("title").html());
			}
		}
	}
	/**
	 * 根据result.data设置页面每个元素的个性信息
	 */
	baseUtil.loadResultData = function(result, form, upload) {
		var that = this;
		if (!that.isNullOrEmpty(result)) { //根据result处理不同的元素
			layui.each(result.data, function(index, item) {
				layui.each(item.children, function(index, child) {
					if (child.edittype == "select") {
						//设置app_codeitem对应的级联的情况
						if (!that.isNullOrEmpty(child.formattype) && !that.isNullOrEmpty(child.formattype.ssbmbhfield)) {
							form.on('select(' + child.formattype.ssbmbhfield + ')', function(data) {
								that.loadSelectBySsbmbhAndSsmxbh(child.field, child.formattype.bmbh, child.formattype.ssbmbh, $('#' +
									child.field + '').val(), $('#' + child.formattype.ssbmbhfield + '').val(), form);
							});
						}
					} else if (child.edittype == "file") {
						//设置单独的编码表的对应的级联的情况
						//文件列表上传
						var _table = result.table;
						that.fileListUpload(child.field, _table + '_' + child.field, upload);
						that.fileListLoad(child.field, _table + '_' + child.field, upload);
					} else if (child.edittype == "image") {
						//图片上传
						var _table = result.table;
						that.imageUpload(child.field, _table + '_' + child.field, upload);
						that.imageLoad(child.field, _table + '_' + child.field, upload);
					} else if (child.edittype == "loadtable") {
						$('#' + child.field).attr("readonly", "readonly");
						//点击弹出
						try {
							if (!that.isNullOrEmpty(child.formattype.tablelx)) {
								that["loadTable" + child.formattype.tablelx](child.field, child.formattype.tableurl, child.formattype.tableparentids,
									child.formattype.tableids);
							} else {
								throw 'error';
							}
						} catch (err) {
							$('#' + child.field).bind('click', function() {
								layer.msg("加载弹出选择框失败，请检查配置文件");
							})
						}
					}
				})
				layui.each(item.children, function(index, child) {
					if (child.edittype == "select") {
						/*if(!that.isNullOrEmpty($("#"+child.field).val())){
							//$('#'+child.field).siblings("div.layui-form-select").find('dl dd[lay-value=' + $("#"+child.field).val() + ']').click();
							//不知道为什么，但是不加延时不好使，后期检查
							setTimeout(function () {
								$('#'+child.field).next().find('.layui-anim').children('dd[lay-value="' + $("#"+child.field).val() + '"]').click();
							},100);
						}*/
					} else if (child.edittype == "formselects") {
						$('#' + child.field).css("display", "none");
					}
				})
			})
		}
	}
	/**
	 * 根据result.data设置页面每个元素的个性信息
	 */
	baseUtil.loadResultDataView = function(result, form, upload) {
		var that = this;
		if (!that.isNullOrEmpty(result)) { //根据result处理不同的元素
			layui.each(result.data, function(index, item) {
				layui.each(item.children, function(index, child) {
					if (child.edittype == "file") {
						//设置单独的编码表的对应的级联的情况
						//文件列表上传
						var _table = result.table;
						that.fileListLoad(child.field, _table + '_' + child.field, upload);
						$('#' + child.field + '_docid').parent().find('tr').each(function(index, tritem) {
							$(this).children().eq(3).remove();
							$(this).children().eq(2).remove();
						})
					} else if (child.edittype == "image") {
						//图片上传
						var _table = result.table;
						that.imageLoad(child.field, _table + '_' + child.field, upload);
					}
				})
			})
		}
		//将复选框disabled样式调整为readonly
		that.setReadOnlyCheckbox();
		//将下拉框disabled样式调整为readonly
		that.setReadOnlySelect();
	}
	/**
	 * 将下拉框disabled样式调整为readonly
	 */
	baseUtil.setReadOnlySelect = function() {
		layui.each($('div .layui-select-title input'), function(index, item) {
			//console.log($(this).attr('class'));
			if ($(this).attr('class').indexOf('layui-disabled') >= 0) {
				$(this).removeClass('layui-disabled');
				$(this).attr('readonly', 'readonly');
			}
		});
	}
	/**
	 * 将复选框disabled样式调整为readonly
	 */
	baseUtil.setReadOnlyCheckbox = function() {
		layui.each($('div .layui-form-checkbox'), function(index, item) {
			//console.log($(this).attr('class'));
			if ($(this).attr('class').indexOf('layui-form-checked') >= 0) {
				$(this).removeClass('layui-checkbox-disbaled');
			}
		});
	}

	/**
	 * 根据result设置对应元素的信息
	 */
	baseUtil.loadResult = function(result, laydate, form, upload) {
		var that = this;

		that.loadResultModname(result);
		that.loadResultJsconfigAfterRender(result, laydate, form);
		that.loadResultData(result, form, upload);

	}
	/**
	 * 根据result设置对应元素的信息
	 */
	baseUtil.loadResultView = function(result, laydate, form, upload) {
		var that = this;

		that.loadResultModname(result);
		result.jsconfig.loadDate = '';
		that.loadResultJsconfigAfterRender(result, laydate, form);
		that.loadResultDataView(result, form, upload);

	}
	/**
	 * 根据result加载模板
	 */
	baseUtil.loadTplByResult = function(result, tplid, formid, form, laytpl) {
		var that = this;
		if (!that.isNullOrEmpty(result)) {
			var htmlTemplate = $('#' + tplid).html();
			var $tplForm = $('#' + formid);
			laytpl(htmlTemplate).render(result, function(html) {
				$tplForm.append(html);
			});
			form.render();
		}
	}
	/**
	 * 检查登录用户信息，没有的话跳转到登录页
	 */
	baseUtil.getSessionUser = function() {
		var _ajaxTypeStr = "POST";
		var _ajaxAsyncFlag = false;
		var _ajaxUrlStr = wlWeb + "/sys?_service=/user/getSessionUser";
		var _ajaxDataObj = {};
		var _ajaxDataTypeStr = "json";
		var _ajaxErrorMsgStr = "我是加载错误的提示信息";
		var result = baseUtil.ajax(_ajaxTypeStr, _ajaxAsyncFlag, _ajaxUrlStr, _ajaxDataObj, _ajaxDataTypeStr,
			_ajaxErrorMsgStr);
		if (result && result.success) {
			return result.obj;
		} else {
			return location.href = location.origin + location.pathname;
		}
	}
	/**
	 * 登出系统，并且跳转到登录页
	 */
	baseUtil.logOut = function() {
		admin.req({
			url: wlWeb + '/sys?_service=/user/logout',
			type: 'get',
			data: {},
			done: function(res) { //这里要说明一下：done 是只有 response 的 code 正常才会执行。而 succese 则是只要 http 为 200 就会执行
			},
			success: function() {
				//清空本地记录的 token，并跳转到登入页
				//清空本地记录的 token
				layui.data(setter.tableName, {
					key: setter.request.tokenName,
					remove: true
				});
				//跳转到登入页
				location.href = wlProtocol + wlHost + wlPort +
					wlWeb + '/view/sys/user/login.html';
			},
			error: function() {
				//清空本地记录的 token，并跳转到登入页
				//清空本地记录的 token
				layui.data(setter.tableName, {
					key: setter.request.tokenName,
					remove: true
				});
				//跳转到登入页
				location.href = wlProtocol + wlHost + wlPort +
					wlWeb + '/view/sys/user/login.html';
			}
		});
	}

	/**
	 * 重写的form.val方法,兼容多选插件
	 * @pram formLayFilter
	 * @pram result
	 * @pram formSelectsObj 多选下拉框的内容{"field":"","value":""}
	 * 
		var formSelectJson = {"field":"szssdm","value":"11"};
	 */
	baseUtil.formVal = function(formLayFilter, result, pageEditConfig) {
		form.val(formLayFilter, result.obj);

		if (pageEditConfig &&
			pageEditConfig.jsconfig &&
			pageEditConfig.jsconfig.loadFormselects &&
			pageEditConfig.jsconfig.loadFormselects.field) {
			var formSelectsFields = pageEditConfig.jsconfig.loadFormselects.field;
			var fieldsArr = Object.keys(result.obj);
			var formSelectsObj = new Object();
			formSelectsObj.field = '';
			formSelectsObj.value = '';
			for (var i = 0; i < fieldsArr.length; i++) {
				var field = fieldsArr[i];
				if (formSelectsFields.indexOf(field) > -1) {
					formSelectsObj.field += field + '||';
					formSelectsObj.value += result.obj[field] + '||';
				}
			}

			// 多选下拉框数据加载
			// 因","和多选冲突,所以使用"||" 切割
			if (formSelectsObj && formSelectsObj.field && formSelectsObj.value) {
				var _fields = formSelectsObj.field.split("||");
				var _values = formSelectsObj.value.split("||");
				if (_fields.length != _values.length) {
					console.log("调用formVal方法时，给定的参数不合法(两个参数包含的元素长度不一致)，停止调用！");
					return;
				}
				for (var i = 0; i < _fields.length; i++) {
					formSelects.value(_fields[i], _values[i].split(","));
				}
			}
		}
	}

	/**
	 * 生成一个layui的树
	 * @pram id 生成树标签id
	 * @pram nodes 生成树需要的数据
	 * @pram isCheckbox 是否多选
	 * @pram isTable 节点是否显示table
	 * @pram tableidArr 需要生成table的节点id数组
	 * @pram tableValue 生成table需要的数据
	 * @pram defaultValue 默认值
	 * @pram testtree js对象
	 * HL 20190213 注意：生成树时模块编码中"."被替换为"_"
	 */
	baseUtil.loadTree = function(id, nodes, isCheckbox, isTable, tableidArr, tableValue, defaultValue, testtree) {
		var that = this;
		var regS = new RegExp("\\.", "g"); //正则对象
		// 创建树
		testtree({
			elem: '#' + id //指定元素
				,
			nodes: nodes,
			click: function(item) {
				if (isTable) {
					if ($('#' + item.id).attr("class") == "layui-hide") {
						$('#' + item.id).removeClass("layui-hide").addClass("layui-table layui-form-item");
					} else {
						$('#' + item.id).removeClass("layui-table layui-form-item").addClass("layui-hide");
					}
				}
			}
		});
		// 是否显示节点的table
		if (isCheckbox) {
			// 绑定复选框选中监听
			form.on('checkbox(zwebcheckbox1)', function(data) {
				that.setTreeNodeCheckbox(data.elem.id, data.elem.checked);
				that.setTreeTableCheckbox();
				form.render('checkbox');
			});
		} else {
			// 绑定复选框选中监听
			form.on('checkbox(zwebcheckbox1)', function(data) {
				$('[lay-filter="zwebcheckbox1"]').each(function() {
					$(this).prop('checked', false);
					$(this).attr('checked', false);
				})
				$('#' + data.elem.id).prop('checked', true);
				$('#' + data.elem.id).attr('checked', true);
				form.render('checkbox');
			});
		}
		// 创建表格
		if (isTable) {
			that.createTreeModuleTable(tableidArr, tableValue);
			// table中的数据
			var datarightid;
			for (var i = 0; i < defaultValue.length; i++) {
				$('#' + defaultValue[i].mkbm.replace(regS, '_') + 'check').attr('checked', true);
				datarightid = defaultValue[i].mkbm.replace(regS, '_') + defaultValue[i].czbm + defaultValue[i].sjbm;
				$('#' + datarightid).attr('checked', true);
			}
			that.setTreeTableCheckbox();
		}
		form.render();
	}

	/**
	 * 模块无权限时,模块方法,数据权限清空,且不可选
	 */
	baseUtil.setTreeTableCheckbox = function() {
		$('[moduleid]').each(function() {
			var moduleid = $(this).attr('moduleid');
			if (!$('#' + moduleid).prop('checked')) {
				$(this).attr('checked', false);
				$(this).prop('checked', false);
				$(this).prop('disabled', true);
				$(this).attr('disabled', true);
			} else {
				$(this).prop('disabled', false);
				$(this).attr('disabled', false);
			}
		})
	}

	/**
	 * 设置复选框级联选中
	 */
	baseUtil.setTreeNodeCheckbox = function(checkboxid, checked) {
		var that = this;
		var checkobj = $('#' + checkboxid);
		if (checkobj) {
			if (checked) {
				var parentid = checkobj.attr("parentid");
				if (parentid) {
					$('#' + parentid).attr('checked', true);
					$('#' + parentid).prop('checked', true);
					that.setTreeNodeCheckbox(parentid, checked);
				}
			}

			if (!checked) {
				$('[parentid]').each(function() {
					if ($(this).attr('parentid') == checkboxid) {
						$(this).attr('checked', false);
						$(this).prop('checked', false);
						that.setTreeNodeCheckbox($(this).attr("id"), checked);
					}
				})
			}
		}
	}
	/**
	 * 创建节点的table
	 * HL 20190213 注意：生成树时模块编码中"."被替换为"_"
	 */
	baseUtil.createTreeModuleTable = function(tableidArr, tableValue) {
		var regS = new RegExp("\\.", "g"); //正则对象
		for (var idindex = 0; idindex < tableidArr.length; idindex++) {
			for (var i = 0; i < tableValue.length; i++) {
				if (!tableValue[i].modulemethod[0] || !tableValue[i].moduledata[0]) continue;
				if (tableValue[i].module.mkbm && tableidArr[idindex] == tableValue[i].module.mkbm.replace(regS, '_')) {
					var tableStr = '';
					tableStr += '  <colgroup>';
					tableStr += '    <col width="100">';
					for (var j = 0; j < tableValue[i].moduledata.length; j++) {
						tableStr += '    <col width="200">';
					}
					tableStr += '    <col width="200">';
					tableStr += '    <col>';
					tableStr += '  </colgroup>';
					tableStr += '  <thead>';
					tableStr += '    <tr>';
					tableStr += '      <th></th>';
					for (var j = 0; j < tableValue[i].moduledata.length; j++) {
						tableStr += '      <th>' + tableValue[i].moduledata[j].sjmc + '</th>';
					}
					tableStr += '      <th>操作</th>';
					tableStr += '    </tr>';
					tableStr += '  </thead>';
					tableStr += '  <tbody>';
					for (var j = 0; j < tableValue[i].modulemethod.length; j++) {
						tableStr += '    <tr>';
						tableStr += '      <td>' + tableValue[i].modulemethod[j].czmc + '</td>';
						for (var k = 0; k < tableValue[i].moduledata.length; k++) {
							tableStr +=
								'      <td><input type="checkbox" name="dataright" lay-filter="zwebcheckbox2" lay-skin="primary" moduleid="' +
								tableidArr[idindex] + 'check" value="' + tableidArr[idindex] + '||' + tableValue[i].modulemethod[j].czbm +
								'||' + tableValue[i].moduledata[k].sjbm + '" id="' + tableidArr[idindex] + tableValue[i].modulemethod[j].czbm +
								tableValue[i].moduledata[k].sjbm + '"></td>';
						}
						tableStr += '      <td><button class="layui-btn">设置字段</button></td>';
						tableStr += '    </tr>';
					}
					tableStr += '  </tbody>';

					$('#' + tableidArr[idindex]).append(tableStr);
					$('#' + tableidArr[idindex]).attr("style", "width: 800px;margin-left: 70px;");
				}
			}
		}
	}

	/**
	 * 隐藏父节点的元素
	 * @param ids [id1,id2,id3]
	 * @param parentnums [parentnums1,parentnums2,parentnums3,]父元素的层级
	 */
	baseUtil.hideParent = function(ids, parentnums) {
		if (ids != null && parentnums != null) {
			var idArr = ids.split(",");
			var parentnumArr = parentnums.split(",");
			if (idArr.length == parentnumArr.length) {
				for (var i = 0; i < idArr.length; i++) {
					var temp = $('#' + idArr[i]);
					var parentnum = parseInt(parentnumArr[i]);
					for (var j = 0; j < parentnum; j++) {
						temp = temp.parent();
					}
					temp.hide();
					temp.find("[lay-verify]").each(function(k, item) {
						var $item = $(item);
						$item.removeAttr("lay-verify");
					})
				}
			}
		}
	}
	
	/**
	 * 删除父节点的元素
	 * @param ids [id1,id2,id3]
	 * @param parentnums [parentnums1,parentnums2,parentnums3,]父元素的层级
	 */
	baseUtil.removeParent = function(ids, parentnums) {
		if (ids != null && parentnums != null) {
			var idArr = ids.split(",");
			var parentnumArr = parentnums.split(",");
			if (idArr.length == parentnumArr.length) {
				for (var i = 0; i < idArr.length; i++) {
					var temp = $('#' + idArr[i]);
					var parentnum = parseInt(parentnumArr[i]);
					for (var j = 0; j < parentnum; j++) {
						temp = temp.parent();
					}
					temp.remove();
				}
			}
		}
	}

	/**
	 * 显示隐藏项,
	 * @param ids 需要显示的元素 [id1,id2,id3]
	 * @param parentnums 需要显示元素对应div的层级 [parentnums1,parentnums2,parentnums3,]
	 * @param verifys 表单项中需要校验的参数,比如必填,数字等校验,如果没有,写null 参数类型为数组 [verifys1,verifys2,verifys3,]
	 */
	baseUtil.showParent = function(ids, parentnums, verifys) {
		var idArr = ids.split(",");
		var parentnumArr = parentnums.split(",");
		var verifyArr = verifys.split(",");
		if (idArr.length == parentnumArr.length && idArr.length == verifyArr.length) {
			for (var i = 0; i < idArr.length; i++) {
				var temp = $('#' + idArr[i]);
				temp.attr("lay-verify", verifyArr[i]);
				var parentnum = parseInt(parentnumArr[i]);
				for (var j = 0; j < parentnum; j++) {
					temp = temp.parent();
				}
				temp.show();
			}
		}
	}

	/**
	 * 提交表单，成功关闭弹窗
	 */
	baseUtil.formSubmit = function(submitUrl) {
		var that = this;
		var submitBtnLayFilter = $(".layerCard button[lay-submit]").attr("lay-filter");
		form.verify({
			checklength: function(value, item) {
				var $ele = $(item);
				if ($ele && !that.isNullOrEmpty(value)) {
					var valLength = $ele.val().length;
					var maxLength = $ele.attr("maxlength");
					if (maxLength && maxLength < valLength) {
						return "最多只能输入" + maxLength + "个字符！";
					}
				}
			},
			checkyzbm: function(value, item) {
				var $ele = $(item);
				if ($ele && !that.isNullOrEmpty(value)) {
					var reg = /^[0-9]{6}$/;
					if (!reg.test(value)) {
						return "邮政编码格式有误，请重新输入";
					}
				}
			},
			required: function(value, item) {
				var $ele = $(item);
				if ($ele) {
					//	    				var reg = /^[\S]+$/;
					var reg = /^[\s\S]*.*[^\s][\s\S]*$/;
					if (!reg.test(value)) {
						console.log($ele)
						if ($ele['context'].tagName == 'SELECT') {
							var id = $ele['context'].id
							$ele['context'].nextSibling['className'] = 'layui-form-select layui-form-selected'
							var parentObj = $ele['context'].parentNode.parentNode.firstElementChild.innerText
							var top = baseUtil.getElementTop($ele['context'].parentNode) - 10
							window.scrollTo(0, top)
							//								$ele['context'].insertBefore(a,$ele['context'])
							return parentObj + '不能为空';
							//								
						} else {
							return "必填项不能为空";
						}

						//return $ele.attr("id")+"不能为空";
						//return "必填项不能为空";
					}
				}
			},
			integer: function(value, item) {
				var $ele = $(item);
				if ($ele && !that.isNullOrEmpty(value)) {
					var reg = /^\d+$/g;

					if (!reg.test(value)) {
						return "请填写整数!";
					}
				}
			},
			email: function(value, item) {
				var $ele = $(item);
				if ($ele && !that.isNullOrEmpty(value)) {
					var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
					if (!reg.test(value)) {
						return "请填写正确的邮箱!";
					}
				}
			},
			identity: function(value, item) {
				var $ele = $(item);
				if ($ele && !that.isNullOrEmpty(value)) {
					//   var reg = /(^\d{15}$)|(^\d{17}(x|X|\d)$)/;
					var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
					if (!reg.test(value)) {
						return "请输入正确的身份证号!";
					}
				}
			},
			phone: function(value, item) {
				var $ele = $(item);
				if ($ele && !that.isNullOrEmpty(value)) {
					var reg = /^1\d{10}$/;
					if (!reg.test(value)) {
						return "请填写正确的手机号!";
					}
				}
			},
			number: function(value) {
				if (!that.isNullOrEmpty(value) && isNaN(value)) return '只能填写数字'
			}


		});
		/* 监听提交 */
		form.on('submit(' + submitBtnLayFilter + ')', function(data) {
			var fields = $(data.form).serialize();
			var dataUrl = submitUrl;
			var _ajaxTypeStr = "POST";
			var _ajaxAsyncFlag = false;
			var _ajaxUrlStr = dataUrl;
			var _ajaxDataObj = fields;
			var _ajaxDataTypeStr = "json";
			var _ajaxErrorMsgStr = "数据加载出错";
			baseUtil.ajaxAdmin(_ajaxTypeStr, _ajaxAsyncFlag, _ajaxUrlStr, _ajaxDataObj, _ajaxDataTypeStr, _ajaxErrorMsgStr,
				function(result) {
					if (!baseUtil.isNullOrEmpty(result)) {
						if (result.success) {
							var index = parent.layer.getFrameIndex(window.name);
							let msg = "修改成功";
							if(result.msg){
								if(result.msg=="新增成功"){
									msg = "新增成功";
								}
							}
							parent.layer.msg(msg);
							parent.layer.close(index);
							//HL20190814将所有页面刷新操作，写在各个操作中，特殊页面特殊处理！（该刷页面的刷页面，该刷table的刷table）
							//forexample：autotable.addtoolbar
							//							window.parent.location.reload();
						} else {
							layer.msg(result.msg);
						}
					} else {
						layer.msg("基础调用方法数据加载出错，baseUtil.ajaxAdmin");
					}
				});
			return false;
		});
	}

	baseUtil.initProcessesImage = function(divid, data) {
		if (data && data.success) {
			$("#" + divid).append('<div id="splc" style="align: center; text-align: center;"><img style="max-width: 100%" src="/' + window.location.pathname
				.substring(1).split("/")[0] + '/sys/fileShowActivitiImage?_fileid=' + data.msg + '&_filetype=png"/></div>'); // 审批流程
		}
	}

	/**
	 * 页面加载审批日志信息
	 * @param divid 加载审批日志的div
	 * @param data 审批日志数据,若没有传入空数组
	 */
	baseUtil.initSprzxx = function(divid, data) {
		layui.use(['table'], function(args) {
			var tableHtml = '<table class="layui-hide" id="table-page" lay-filter="table-page"></table>';
			$('#' + divid).append(tableHtml);
			var table = layui.table;
			var cols = [
				[{
					field: 'id',
					title: '顺序号',
					width: '10%'
				}, {
					field: 'time',
					title: '时间',
					width: '15%',
					templet: function(d) {
						return baseUtil.dateFtt('yyyy-MM-dd HH:mm:ss', new Date(d.time));
					}
				}, {
					field: 'czrmc',
					title: '操作人',
					width: '10%'
				}, {
					field: 'yhlx',
					title: '操作人类型',
					width: '10%'
				}, {
					field: 'czzt',
					title: '审核状态',
					width: '10%'
				}, {
					field: 'shyj',
					title: '审核意见'
				}]
			];
			var tableIns = table.render({
				elem: "#table-page", //表格id
				data: data, //列表数据连接
				cols: cols, //表头数据
				cellMinWidth: 80,
				page: false,
				text: {
					none: '暂无审批记录'
				}
			});
			tableIns.reload();
		});
	}

	/**
	 * 时间格式化
	 */
	baseUtil.dateFtt = function(fmt, date) {
		var o = {
			"M+": date.getMonth() + 1, //月份   
			"d+": date.getDate(), //日   
			"H+": date.getHours(), //小时   
			"m+": date.getMinutes(), //分   
			"s+": date.getSeconds(), //秒   
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度   
			"S": date.getMilliseconds() //毫秒   
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}
	//
	//
	//
	/**
	 * 初始化和加载下拉框                                                      
	 * {valueField: "mxbh", textField: "mxz", selectedValue: ""}  
	 * valueField:value值对应的字段, textField:汉字对应的字段,selectedValue:选中的值  
	 */
	baseUtil.renderSelectOptions = function(data, settings) {
		settings = settings || {};
		var valueField = settings.valueField || 'value',
			textField = settings.textField || 'text',
			selectedValue = settings.selectedValue || "";
		var html = [];
		if (null != data && data.length > 0) {
			for (var i = 0, item; i < data.length; i++) {
				item = data[i];
				html.push('<option value="');
				html.push(item[valueField]);
				html.push('"');
				if (selectedValue && item[valueField] == selectedValue) {
					html.push(' selected="selected"');
				}
				html.push('>');
				html.push(item[textField]);
				html.push('</option>');
			}
		}
		return html.join('');
	}

	/**
	 * 页面参数传递时,使用全局的参数进行传递,设置全局参数
	 * @param name 参数key
	 * @param valueObj 所传递的参数对象 {"key",value}
	 */
	baseUtil.setDataParams = function(name, valueObj) {
		layui.data("dataparam_" + name, {
			key: name,
			value: valueObj
		});
	}

	/**
	 * 页面参数传递时,使用全局的参数进行传递,获取全局参数
	 * 获取到以后,进行删除
	 * @param name 参数key
	 */
	baseUtil.getDataParams = function(name) {
		// 获取缓存的数据
		var returnData = layui.data("dataparam_" + name)[name];
		// 删除掉缓存数据(表示缓存的数据只能获取一次)
		layui.data("dataparam_" + name, null);
		return returnData;
	}

	/**
	 * 批量给页面元素设置属性(readonly,disabled)
	 */
	baseUtil.setAttribute = function(ids, atrrstr, form) {
		if (!baseUtil.isNullOrEmpty(ids)) {
			var idArr = ids.split(",");
			for (var i = 0; i < idArr.length; i++) {
				if ($("#" + idArr[i]).length > 0) {
					$("#" + idArr[i]).attr(atrrstr, true);
				}
			}
			form.render();
		}
	}


	/**
	 * 系统中用到的数字数组(周次,节次)
	 */
	baseUtil.numberArr = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五", "十六",
		"十七", "十八", "十九", "二十", "二十一", "二十二", "二十三", "二十四", "二十五"
	];
	/**
	 * 数字转为汉字
	 */
	baseUtil.numberToChinese = function(number) {
		var that = this;
		if (number > 0 && number < that.numberArr.length) {
			return that.numberArr[number];
		}
		return "";
	}
	/**
	 * 汉字转数字
	 */
	baseUtil.chineseToNumber = function(str) {
		var that = this;
		if (!that.isNullOrEmpty(str) && baseUtil.numberArr.indexOf(str) != -1) {
			return baseUtil.numberArr.indexOf(str);
		}
		return "";
	}


	/**
	 * url参数
	 */
	baseUtil.getQueryString = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return decodeURI(r[2]);
		return null;
	}


	/**
	 * header是否显示
	 * headerID 
	 */
	baseUtil.showHeader = function(headerID, showID, title) {
		var titles = baseUtil.getQueryString(title)
		$('#' + showID).text(titles);

		if (title) {
			$('#' + headerID).show()
		} else {
			$('#' + headerID).hide()
		}
	}
	/**
	 * 引入头部 
	 * elem:页面最外层元素id
	 */
	baseUtil.prependHead = function(elem) {
		$('body').prepend("<div id='head'></div>")
		$("#head").load(pageweb + "/view/header_student.html");
		$('#head').hide()
		setTimeout(function() {
			var title = baseUtil.getQueryString('title')
			if (!baseUtil.isNullOrEmpty(title)) {
				$('#title').text(title)
				var crumb = $('#crumb')
				$('.layui-card-body').css('padding-top', '0px')
				$('#' + elem + ' .layui-container').eq(0).css('width', '100%')
				$('#' + elem + ' .layui-col-md12').eq(0).prepend(crumb)
				$('#head').show()
				$('.crumb').show()
				document.title = title
			}

		}, 100)
	}
	
	/**
	 * 关闭弹框 
	 * 
	 */
	baseUtil.CloseparentLayer = function() {
		var parentLayerCloseIndex = parent.layer.getFrameIndex(window.name); //获取窗口索引
		if (parentLayerCloseIndex) {
			setTimeout(function(){
				parent.layer.close(parentLayerCloseIndex);
			},500)
			
		} 
	}
	/**
	 * 倒计时
	 * 
	 */
	baseUtil.TimeDown = function() {
	    //结束时间
	    var endDate = new Date(endDateStr);
	    //当前时间
	    var nowDate = new Date();
	    //相差的总秒数
	    var totalSeconds = parseInt((endDate - nowDate) / 1000);
	    //天数
	    var days = Math.floor(totalSeconds / (60 * 60 * 24));
	    //取模（余数）
	    var modulo = totalSeconds % (60 * 60 * 24);
	    //小时数
	    var hours = Math.floor(modulo / (60 * 60));
	    modulo = modulo % (60 * 60);
	    //分钟
	    var minutes = Math.floor(modulo / 60);
	    //秒
	    var seconds = modulo % 60;
	    //输出到页面
	    if(totalSeconds>=0){
	    	 return  "还剩:" + days + "天" + hours + "小时" + minutes + "分钟" + seconds + "秒";
	    }else{
	    	 return  "还剩:0天0小时0分钟0秒";ddddd
	    }
	   
	    //延迟一秒执行自己
	    setTimeout(function () {
	        TimeDown(endDateStr);
	    }, 1000)
	}
	
	/**
	 *  上传类型：exts
	 *  eleid:页面点击上传按钮的id
	 *  URL:文件上传请求Url。例如：var url = wlFileUploadUrl('yjs_xw_sqxwyjsxx_pslwdzbzdz',baseUtil.uuid());
	 *  upload:Layui的上传文件模块
	 *  filetype：上传文件类型：例如：yjs_xw_sqxwyjsxx_pslwdzbzdz
	 *  p_text:提示文字内容
	 */
	baseUtil.uploadFile = function(eleid,filetype,p_text,exts="*"){

		if($("#"+eleid).siblings('a').length==0){
			$("#"+eleid).after('<a class="downpdf"  title="点击下载查看"></a><input class="hide" type="hidden" name="_'+eleid+'"   value="" /><p class="tips">* '+ p_text +'</p>');
		}
		layui.upload.render({
		    elem: "#"+eleid,//绑定元素
			exts:exts,
		    url: wlFileUploadUrl(filetype,baseUtil.uuid()), //上传接口
			accept: 'file',
		    done: function(res){
		      //上传完毕回调
		      $("#"+eleid).text('已上传')
		      $("#"+eleid).siblings('input.hide').val(res.obj.refid)
		      $("#"+eleid).siblings('a').text(res.obj.orgfilename)
		      $("#"+eleid).siblings('a').attr('href',wlFileDownByFileidUrl(res.obj.fileid))
		    },
		    error: function(){
		      //请求异常回调
		    	layer.msg("上传失败，请重新上传");
		    }
		  });
		
		
	}

	/**
	 *  exts:上传类型  多类型的以‘|’为分隔符
	 *  eleid:页面点击上传按钮的id
	 *  filetype：上传文件类型：例如：yjs_xw_sqxwyjsxx_pslwdzbzdz
	 *  p_text:提示文字内容
	 *  type:button种类 :add是上传,edit是编辑
	 *  inputName:为保存入数据库的input的name
	 */
	baseUtil.downFile = function(eleid,filetype,p_text='',exts="*",type,inputName){
		$("#"+eleid).after('<a class="downpdf"  title="点击下载查看"></a><input class="hide" type="hidden" name="'+inputName+'"   value="" /><p class="tips">* '+ p_text +'</p>');
		if(type=='edit'){
			var obj = baseUtil.pdfLoad(eleid,filetype)
			$("#"+eleid).prev().text(obj.orgfilename)
			$("#"+eleid).prev().attr('href',wlFileDownByFileidUrl(obj.fileid))
		}
		
		upload.render({
		    elem: "#"+eleid,//绑定元素
			exts:exts,
		    url: wlFileUploadUrl(filetype,baseUtil.uuid()), //上传接口
			accept: 'file',
		    done: function(res){
		      //上传完毕回调
		      $("#"+eleid).text('已上传')
		      $("#"+eleid).siblings('input.hide').val(res.obj.refid)
		      $("#"+eleid).siblings('a').text(res.obj.orgfilename)
		      $("#"+eleid).siblings('a').attr('href',wlFileDownByFileidUrl(res.obj.fileid))
		    },
		    error: function(){
		      //请求异常回调
		    	layer.msg("上传失败，请重新上传");
		    }
		  });
	}
	
	baseUtil.loadTplByEdit = function(result, tplid, formid, form, laytpl) {
		var that = this;
		var html=''
		if (!that.isNullOrEmpty(result)) {
			var htmlTemplate = $('#' + tplid).html();
			html+=''
			form.render();
		}
	}
	/**
	 *  数组对象去重
	 *  data:数组
	 *  filed:对象里的字段
	 */
	baseUtil.onlyOne = function(data,field) {
		 	var result = [];
		    var obj = {};
		    for(var i =0; i<data.length; i++){
		       if(!obj[data[i].field]){
		          result.push(data[i]);
		          obj[data[i].field] = true;
		       }
		    }
		    return result;
	}

	/**
	 *	上传下载的整合,根据inputVal是否为空进行判断，inputVal为空则为上传
	 *
	 * @param exts:上传类型  多类型的以‘|’为分隔符
	 * @param eleid:页面点击上传按钮的id
	 * @param filetype：上传文件类型：例如：yjs_xw_sqxwyjsxx_pslwdzbzdz
	 * @param  p_text:提示文字内容
	 * @param inputName:为保存入数据库的input的name
	 * @param inputVal :为保存入数据库的文件的值，可为空，一般编辑的时候可以传值
	 *
	 */

	baseUtil.fileSuccess = function(eleid,filetype,p_text='',exts="*",inputName,inputVal=''){
		$("#"+eleid).after('<a class="downpdf"  title="点击下载查看"></a><input class="hide" type="hidden" name="'+inputName+'"   value="'+ inputVal +'" /><p class="tips">'+ p_text +'</p>');
		if(!baseUtil.isNullOrEmpty(inputVal)){
			var obj = baseUtil.lwLoad(filetype,inputVal)
			$("#"+eleid).text('已上传')
			$("#"+eleid).siblings('a').text(obj.orgfilename)
			$("#"+eleid).siblings('a').attr('href',wlFileDownByFileidUrl(obj.fileid))
		}

		upload.render({
			elem: "#"+eleid,//绑定元素
			exts:exts,
			url: wlFileUploadUrl(filetype,baseUtil.uuid()), //上传接口
			accept: 'file',
			done: function(res){
				//上传完毕回调
				$("#"+eleid).text('已上传')
				$("#"+eleid).siblings('input.hide').val(res.obj.refid)
				$("#"+eleid).siblings('a').text(res.obj.orgfilename)
				$("#"+eleid).siblings('a').attr('href',wlFileDownByFileidUrl(res.obj.fileid))
			},
			error: function(){
				//请求异常回调
				layer.msg("上传失败，请重新上传");
			}
		});
	}

	/**
     *	时间格式 20190101  补0
     *
     * @param timestamp:时间戳
     *
     */
    baseUtil.getTimes = function(timestamp){
        return new Date(timestamp).getFullYear()+''+(new Date(timestamp).getMonth()+1<10?"0"+(new Date(timestamp).getMonth()+1):new Date(timestamp).getMonth()+1)+''+(new Date(timestamp).getDate()<10?"0"+new Date(timestamp).getDate():new Date(timestamp).getDate())
    }
    /**
     *	时间格式 20190101 转换为 时间戳
     *
     * @param timestamp:20190101
     *
     */
    baseUtil.timestamp = function(timestamp){
        let year=Number(timestamp.substring(0,4))
        let month=Number(timestamp.substring(4,6))
        let day=Number(timestamp.substring(6,8))
        return new Date(year,month-1,day)
    }


    baseUtil.templatelist = function(data){
		let html = ''
		data.forEach(item=>{
			html +=`${
				(function () {
					if (item.edittype=='fgf'){
						return `<div class="layui-col-xs12 block">
                                    <blockquote class="layui-elem-quote">${item.edittitle}</blockquote>
                                </div>`
					}else {
						return `<div class="layui-col-xs${item.editwidth?item.editwidth:'12'}">
                        <div class="layui-form-item">
                            <label class="layui-form-label"><span class="${item.editverify==null?'reded':'red'}">*</span>${item.edittitle}：</label>
                            <div class="layui-input-inline" ${item.edittype=='checkbox'?'lang="checkbox"':''}>
                                ${
							(function(){
								if(item.edittype=='select'){
									return `<select name="${item.stxbh}" ${item.isedit=='N'?'disabled':''} id="${item.stxbh}" lay-filter="${item.stxbh}" lay-verify="${item.editverify}">
                                                        <option value="">请选择</option>
                                                    </select>`;
								}else if(item.edittype=='textarea'){
									return `<textarea  class="layui-textarea" ${item.isedit=='N'?'disabled':''} name="${item.stxbh}" id="${item.stxbh}" lay-filter="${item.stxbh}" lay-verify="${item.editverify}"></textarea>`;
								}else if(item.edittype=='checkbox'){
									//未完待续
									return `<input type="checkbox" name="like[write]" title="写作">
                                                    <input type="checkbox" name="like[read]" title="阅读" checked>
                                                    <input type="checkbox" name="like[dai]" title="发呆">`;
								}else if(item.edittype=='radio'){
									//未完待续
									return `<input type="radio" name="sex" value="男" title="男">
                                                    <input type="radio" name="sex" value="女" title="女" checked>`;
								}else if(item.edittype=='file'){
									//未完待续
									return `<button class="layui-btn layui-btn-sm" id="${item.stxbh}">上传</button>`;
								}else if(item.edittype=='img'){
									//未完待续
									return `<input class="layui-input" type="text" ${item.isedit=='N'?'disabled':''} ${item.edittype=='date'?'time':''} ${item.edittype=='date'?'time format':''} name="${item.stxbh}" id="${item.stxbh}" value="" lay-filter="${item.editverify}" lay-verify="${item.editverify}">
                                        <p class="tips">${item.editfromat?`${item.editfromat}`:''}</p>`;
								}else if(item.edittype=='img'){
									//未完待续
									return `<input class="layui-input" type="text" ${item.isedit=='N'?'disabled':''} ${item.edittype=='date'?'time':''} ${item.edittype=='date'?'time format':''} name="${item.stxbh}" id="${item.stxbh}" value="" lay-filter="${item.editverify}" lay-verify="${item.editverify}">
                                        <p class="tips">${item.editfromat?`${item.editfromat}`:''}</p>`;
								}else {
									return `<input class="layui-input" type="text" ${item.isedit=='N'?'disabled':''}  ${item.edittype=='date'?'time':''} ${item.edittype=='date'?'time format':''} name="${item.stxbh}" id="${item.stxbh}" value="" lay-filter="${item.editverify}" lay-verify="${item.editverify}">
                                        <p class="tips">${item.editfromat?`${item.editfromat}`:''}</p>`;
								}
							})()
						}
                            </div>
                        </div>
                    </div>`
					}
				})()
			}`


		})
		$('#layui-container').append(html)
		$('#layui-container').append(`<button style="display: none" class="layui-btn layui-btn" lay-submit lay-filter="submit"  id="submit">提交</button>`)
		form.render()
		let timeInp = $('[time]');
		for (var i = 0; i < timeInp.length; i++) {
			let format =  $(timeInp.eq(i)).attr('format')
			laydate.render({
				elem: $(timeInp.eq(i))[0],
				type: 'month',
				format: format,
				trigger:'click',
				done: function(value) {
					//
				}
			});
		}
	}
	exports("baseUtil", baseUtil);
});
