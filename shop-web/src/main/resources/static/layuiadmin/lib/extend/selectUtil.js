/**
 * 
 * @Name：自动生成select工具
 * @Author：HL
 * 
 */
layui.define([ 'form','jquery'], function(exports) {
	var $ = layui.$;
	var form = layui.form;
	/*
	 * 实例化下拉框
	 * 	@param options
	 * 		{
	 * 			id:""	//select 的标签ID
	 * 			search:true //可搜索
	 * 			data：**list //获取到的数据集合
	 * 			value:'id' //数据集合中的'id'字段为option的value值
	 * 			text:'name'//数据集合中的'name'字段为option的text值
	 * 		}
	 */
	function selectList(options){
		var that = this;
		if(!(options.data) || !(options.id)){
			return;
		}
			
		that.id = options.id;
		that.options = options;
		that.onChange = options.onChange != null ? options.onChange : function () { };//点击事件
		that.data = that.data || [];
		
		if (typeof (options.data) == 'object') {
			that.data = that.arrConversion(options.data);
	    }else{
			$.ajax({
				async:false,
				url:options.data,
				type:'get',
				dataType : "json",
				success:function(returnData){
					if(returnData.success){
						that.data = that.arrConversion(returnData.obj);
					}else{
						return;
					}
				},
				error:function(jqXHR,textStatus,errorThrown){
					return;
				}
			});
		}
		that.makedata();
		that.refresh();
		that.onChangeEvent();
	}
	/*
	 * 数组转换 @param data 需要转换的数据对象
	 */
	selectList.prototype.arrConversion = function(data){
		var that = this;
		var arr = data;
		var value = that.options.value;
		var text = that.options.text;
		var newArr = [];
	    for(var i= 0;i<arr.length;i++ ){
	        var obj = {};
	        obj.value = arr[i][value];
	        obj.text = arr[i][text];
	        newArr.push(obj);
	    }
	    return newArr;
	}
	
	/*
	 * 处理下拉配置信息
	 * 
	 */
	selectList.prototype.makedata =function(){
		var that = this;
		if(!that.id){
			return;
		}
		var options = that.options;
		that.setSelectOptions(options);
		
		var len = that.data.length;
		if(len > 0){
			that.empty();
			$("#" + that.id).append("<option value=''>请选择</option>");
		}
		for(var i=0;i<len;i++){
			var text = that.data[i].text;
			var value = that.data[i].value;
			var disabled = that.data[i].disabled;
			var option = "<option value='" + value + "'>"+ text + "</option>";
			if(disabled){
				option.prop("disabled", true);
			}
			$("#" + that.id).append(option);
		}
	};
	/*
	 * 设置select 属性
	 */
	selectList.prototype.setSelectOptions = function(options){
		var that = this;
		if(options && options.search){
			$("#" + that.id).attr("lay-search",true);
		}
	};
	
	/*
	 * 默认多个选中
	 */
	selectList.prototype.setItemsSelect = function(arr){
		var that = this;
		//暂未开通。后期加入
	}
	/*
	 * 选择全部
	 */
	selectList.prototype.selectAll = function(){
		var that = this;
		//暂未开通。后期加入
	};
	/*
	 * 取消选择全部
	 */
	selectList.prototype.deSelectAll = function(){
		var that = this;
		//暂未开通。后期加入
	};
	/*
	 * 获取所有选择的value值
	 */
	selectList.prototype.getValueItems = function(){
		var arr = [];
		for(var i=0;i<$("#"+this.id+">option").length;i++){
			if($("#"+this.id+">option").eq(i).is(':selected')){
				arr.push($("#"+this.id+">option").eq(i).val())
			}
		}
		return arr;
	};
	
	/*
	 * 默认单个选中
	 */
	selectList.prototype.setItemSelect = function(value){
		$("#"+this.id).val(value);
	}
	
	/*
	 * 设置某个不能选中
	 */
	selectList.prototype.disabled = function(num){
		var num = num-1;
		$("#"+this.id).prev().children('ul').children().eq(num).addClass('disabled');
	};
	/*
	 * 刷新下拉框
	 */
	selectList.prototype.refresh = function(){
		//估计需要form 重新渲染
		//后期加入
	};
	/*
	 * 清空下拉框
	 */
	selectList.prototype.empty = function(){
		$("#"+this.id+">option").remove();
	};
	
	selectList.prototype.onChangeEvent = function(){
		var that = this;
		form.on('select('+that.id+')',function(data){
			data.text = $(data.elem).find("option:selected").text();
			that.onChange(data)
		})
	}
	
	var selectUtil = function(){
		return selectList;
	}

	exports('selectUtil',selectUtil());
});
