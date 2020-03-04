/**
 *
 * @Name：自动加载表格操作
 * @Author：HL
 * 下拉多选 http://sun.faysunshine.com/layui/formSelects-v4/example/example_v4.html#select_value
 */
layui.define([ 'jquery','form','baseUtil', 'table' ,'laydate','formSelects','upload'], function(exports) {
	"use strict";

	var $ = layui.$;
	var table = layui.table;
	var baseUtil = layui.baseUtil;
	var admin = layui.admin;
	var form = layui.form;
	var laydate = layui.laydate;
	var formSelects = layui.formSelects;
	var upload = layui.upload;
	var treeGrid = null;
	
	var setter = layui.setter;
	var _accessToken = layui.data(setter.tableName, {key: setter.request.tokenName });
	console.log("_accessToken="+_accessToken);

	class AutoTable{
		constructor(){
			this.idCode = "id";// 数据ID字段 一般为当前页面名称，（必填）。
			this.tableId = "table-page";// 表格ID
			this.operationBtn = "operationBtn";// 操作列id
			this.hasToolbar = "true";// 是否存在工具条。（默认：true）
			this.toolbarId = "toolbar";// 工具条ID
			this.searchId = "search";// 搜索id
			this.tableTitleUrl = "";// 表头获取Url，（必填）
			this.dataUrl = "";// 数据获取Url，（必填）
			this.editHtml = "";// 新增编辑页面
			this.editarea = null;
			this.viewHtml = "";// 查看页面
			this.showHtml = wlProtocol+wlHost+wlPort+wlWeb+wlModuleWeb+"/sys/entity/entityItemshow.html";// 显示项设置页面
			this.sortHtml = wlProtocol+wlHost+wlPort+wlWeb+wlModuleWeb+"/sys/entity/entityItemsort.html";// 搜索结果排序页面
			this.searchHtml = wlProtocol+wlHost+wlPort+wlWeb+wlModuleWeb+"/sys/entity/entityItemsearch.html";// 搜索条件设置页面
			this.exportmodelHtml = wlProtocol+wlHost+wlPort+wlWeb+wlModuleWeb+"/sys/entity/entityexportmodel.html";//设置导出模板页面
			this.delUrl = "";// 删除Url
			this.isTree = false;// 是否树状表格
			this.treeId = "";//树形id字段名称
			this.treeParentId = "";//树形父id字段名称
			this.treeShowName = "";//以树形式显示的字段 
			this.dataUrlResult = {};
			this.table = table;
			this.whereData = {};//数据初始化时的查询条件
		}
		
		init(){}
		/**
		 * 初始化调用
		 */
		render(){
	    	var that = this;
	    	// 首先获取表头
			var titleData = that.getTableTitle(that);
			if(that.isTree){
				// 加载普通表格数据
				that.loadTreeTable(that,titleData);
		
				layui.use(['treeGrid'],function(){
					treeGrid = layui.treeGrid;
					// 监听表格复选框选择
					treeGrid.on('checkbox(' + that.tableId + ')',
							function(obj) {
								console.log(obj)
							});
					
					// 监听操作列
					treeGrid.on('tool(' + that.tableId + ')',
							function(obj) {
								var data = obj.data;
								var objEvent = obj.event + "Operation";
								if (baseUtil.isFunction(that[objEvent])) {
									that[objEvent] ? that[objEvent](data):'';
								}
							});
				});
				
			}else{
				// 加载普通表格数据
				that.loadTable(that.tableId,titleData,that.dataUrl,that.whereData);
				
				// 监听表格复选框选择
				table.on('checkbox(' + that.tableId + ')',
						function(obj) {
							console.log(obj)
						});
				
				// 监听操作列
				table.on('tool(' + that.tableId + ')',
						function(obj) {
							var data = obj.data;
							var objEvent = obj.event + "Operation";
							if (baseUtil.isFunction(that[objEvent])) {
								that[objEvent] ? that[objEvent](data):'';
							}
						});
				//监听排序事件
				table.on('sort(' + that.tableId + ')', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
					  console.log(obj.field); //当前排序的字段名
					  console.log(obj.type); //当前排序类型：desc（降序）、asc（升序）、null（空对象，默认排序）
					  console.log(this); //当前排序的 th 对象
					  //尽管我们的 table 自带排序功能，但并没有请求服务端。
					  //有些时候，你可能需要根据当前排序的字段，重新向服务端发送请求，从而实现服务端排序，如：
					  table.reload(that.tableId, {
					    initSort: obj //记录初始排序，如果不设的话，将无法标记表头的排序状态。 layui 2.1.1 新增参数
					    ,where:{
					    	orderByField: obj.field, //排序方式
					    	orderByType: obj.type //排序方式
					    }
					  });
				});
			}
			// 监听列表上方按钮
			$('#'+that.toolbarId+' .layui-btn').on('click',function() {
					var checkStatus = table.checkStatus(that.tableId);
					var data = checkStatus.data;
					var type = $(this).data('type') + "Toolbar";
					that[type] ? that[type](data): '';
			});
			//监听查询提交按钮
			$('#'+that.searchId+'_submit').on('click',function(){
				form.on('submit('+that.searchId+')', function (data) {
					var type = $(this).data('type') + "Search";
					that[type] ? that[type](data): '';
				});
			});
			//监听查询设置按钮
			$('#'+that.searchId+'_set').on('click',function(){
				var data = {};
				var type = $(this).data('type') + "Toolbar";
				that[type] ? that[type](data): '';
			});
	    }

	    getArea(){
			let that = this;
			let area = admin.screen() < 2 ? ['95%', '95%'] : ['95%', '95%'];
			if(that.editarea){
				if( typeof that.editarea == "function"){
					area = that.editarea();
				}else{
					area = that.editarea;
				}
			}
			return area;
		}

		/**
		 * （工具条新增）
		 */
	    addToolbar(data){
	    	var that = this;
	    	layer.open({
	    		btnAlign: 'c',
				type : 2,
				title : "添加",
				content : editUrl+that.editHtml,
				maxmin : !0,
				area :  that.getArea(),
				btn : [ "确定","取消" ],
				yes : function(index, layero) {
					var submit = layero.find('iframe').contents().find(".layerCard button[lay-submit]");
		            submit.trigger('click');
		            table.reload(that.tableId);
				},
				btn2 : function(index, layero){
					layer.close(index);
				},
				success : function(layero, index) {
				}
			});
		}
	    /**
	     * （工具条删除）
	     */
	    delToolbar(checkData) { // 验证是否全选
			var that = this;
			var delCount = checkData.length;
			if(delCount == 0){
				layer.msg("请选择要删除的数据");
				return;
			}
			var param = "";
			var idCodeArray = that.idCode;
			for(var i=0; i<checkData.length; i++){
				for(var j=0; j<idCodeArray.length; j++){
					param = param + checkData[i][idCodeArray[j].field];
					if(j!=(idCodeArray.length-1)){
						param = param + "|";
					}
				}
				if(i!=(checkData.length-1)){
					param = param + ",";
				}
			}
			
	    	layer.confirm("确定删除这"+delCount+"条数据？",function(index){
	    		that.delAjax(param);
	    	});
		};
		/**
		 *（工具条导出）
		 */
		exportToolbar(checkData){
			var that = this;
			
			var derivedUrl = wlModuleSysToDerived+"excelExport";
			console.log(derivedUrl);
			
			layer.open({
				type : 1,
				title : "导出",
				content : '<html><body style="background:#fff;"><form id="exportExcelForm" style="padding:15px;"><input type="hidden" id="_service" name="_service">   数据量如果过大，可能需要几分钟时间。请下载完成后,再点击确定关闭。	</form></body></html>',
				btnAlign: 'c',
				btn : ["确定"],
				yes : function(index, layero) {
					layer.close(index);
				},
				success : function(layero, index) {
					$("#exportExcelForm").attr('action',derivedUrl);
					$("#_service").val(derivedUrl.split("_service=")[1]);
					$("#exportExcelForm").submit();
				}
			});
		}
		/**
		 * （工具条：导入）
		 */
		importExcelToolbar(checkData){
			var that = this;
			layer.open({
				type : 1,
				title : "导入",
				area : ['400px', '200px'],
				content : '<div class="layui-upload" style="height:100%;display:flex;justify-content: center;align-items: center;display: flex;"><button type="button" class="layui-btn layui-btn-normal" id="choseExcelFile">选择文件</button><button type="button" class="layui-btn" id="importExcelFileBtn" style="margin-left:10px;">开始上传</button><button type="button" class="layui-btn" id="importExcelModelBtn">下载模板</button></div>',
				btn : [ "取消" ],
				yes : function(index, layero) {
					layer.close(index);
				},
				success : function(layero, layerIndex) {
					upload.render({
					    elem: '#choseExcelFile'
					    ,url: wlModuleSysToImport+'excelImport&_filetype=importFileTemp'
					    ,before: function(obj){
					        	layer.load(); //上传loading
					    	}
					    ,auto: false
					    ,exts: 'xls|xlsx'
					    ,accept:"file"
					    ,bindAction: '#importExcelFileBtn'
					    ,done: function(res, index, upload){
					    	if(res.success){
					    		layer.alert("导入成功",function (alertIndex) {
					    			that.table.reload(that.tableId);
					    			layer.close(alertIndex);
								});
					    	}else{
					    		layer.alert(res.msg);
					    	}
					    	layer.closeAll('loading'); //关闭loading
					    	layer.close(layerIndex);
					    }
					    ,error: function(index, upload){
					    	layer.closeAll('loading'); //关闭loading
					    	layer.close(layerIndex);
					    }
					  });
					
					//加载下载模板事件
					$("#importExcelModelBtn").click(function(){
						that.exportImportExcelModel();
					});
				}
			});
			
		}
		/**
		 * （工具条下载导入模板）
		 */
		exportImportExcelModel(checkData){
			var that = this;
			
			var derivedUrl = wlModuleSysToImportModel+"getPageListConfig";
			layer.open({
				type : 1,
				title : "导入模板下载",
				content : '<form id="exportExcelForm"><input type="hidden" id="_service" name="_service">下载中，请稍等。</form>',
				btnAlign: 'c',
				btn : ["确定"],
				yes : function(index, layero) {
					layer.close(index);
				},
				success : function(layero, index) {
					$("#exportExcelForm").attr('action',derivedUrl);
					$("#_service").val(derivedUrl.split("_service=")[1]);
					$("#exportExcelForm").submit();
				}
			});
			
		}
		/**
	     * （工具条显示项）
	     */
	    showToolbar(checkData) { // 验证是否全选
	    	var that = this;
	    	layer.open({
	    		btnAlign: 'c',
				type : 2,
				title : "显示项设置",
				content : that.showHtml,
				maxmin : !0,
				area : admin.screen() < 2 ? ['95%', '95%'] : ['95%', '95%'],
				btn : [ "确定","取消" ],
				yes : function(index, layero) {
					var submit = layero.find('iframe').contents().find(".layerCard button[lay-submit]");
		            submit.trigger('click');
		            window.location.reload();//页面刷新
				},
				btn2 : function(index, layero){
					layer.close(index);
				},
				success : function(layero, index) {
					console.log("wlModuleSysUrl="+wlModuleSysUrl);
					$("#wlModuleSysUrl", layero.find("iframe")[0].contentWindow.document).val(wlModuleSysUrl);
				}
			});
		};
		/**
	     * （工具条搜索结果排序）
	     */
	    sortToolbar(checkData) { // 验证是否全选
	    	var that = this;
	    	layer.open({
	    		btnAlign: 'c',
				type : 2,
				title : "搜索结果排序设置",
				content : that.sortHtml,
				maxmin : !0,
				area : admin.screen() < 2 ? ['95%', '95%'] : ['95%', '95%'],
				btn : [ "确定","取消" ],
				yes : function(index, layero) {
					var submit = layero.find('iframe').contents().find(".layerCard button[lay-submit]");
		            submit.trigger('click');
		            window.location.reload();//页面刷新
				},
				btn2 : function(index, layero){
					layer.close(index);
				},
				success : function(layero, index) {
					console.log("wlModuleSysUrl="+wlModuleSysUrl);
					$("#wlModuleSysUrl", layero.find("iframe")[0].contentWindow.document).val(wlModuleSysUrl);
				}
			});
		};
		/**
	     * （工具条搜索条件设置）
	     */
	    searchToolbar(checkData) { // 验证是否全选
	    	var that = this;
	    	layer.open({
	    		btnAlign: 'c',
				type : 2,
				title : "搜索条件设置",
				content : that.searchHtml,
				maxmin : !0,
				area : admin.screen() < 2 ? ['95%', '95%'] : ['95%', '95%'],
				btn : [ "确定","取消" ],
				yes : function(index, layero) {
					var submit = layero.find('iframe').contents().find(".layerCard button[lay-submit]");
		            submit.trigger('click');
		            window.location.reload();//页面刷新
				},
				btn2 : function(index, layero){
					layer.close(index);
				},
				success : function(layero, index) {
					console.log("wlModuleSysUrl="+wlModuleSysUrl);
					$("#wlModuleSysUrl", layero.find("iframe")[0].contentWindow.document).val(wlModuleSysUrl);
				}
			});
		};
		//工具条：导出设置
		exportmodelToolbar(checkData){
			var that = this;
			
			layer.open({
	    		btnAlign: 'c',
				type : 2,
				title : "选择导出项",
				content : that.exportmodelHtml,
				maxmin : !0,
				area : ['95%', '95%'],
				btn : [ "确定","取消" ],
				yes : function(index, layero) {
					var submit = layero.find('iframe').contents().find(".layerCard button[lay-submit]");
		            submit.trigger('click');
		            //window.location.reload();//页面刷新
				},
				btn2 : function(index, layero){
					layer.close(index);
				},
				success : function(layero, index) {
					console.log("wlModuleSysUrl="+wlModuleSysUrl);
					$("#wlModuleSysUrl", layero.find("iframe")[0].contentWindow.document).val(wlModuleSysUrl);
				}
			});
		}
		/**
		 * 查看弹窗（查看页面）
		 */
	    detailOperation(data){
	    	var that = this;
	    	layer.open({
	    		btnAlign: 'c',
				type : 2,
				title : "查看",
				content : viewUrl+that.viewHtml,
				maxmin : !0,
				area : that.getArea(),
				btn : ['确认'],
				yes : function(index, layero) {
					layer.close(index);
				},
				success : function(layero, index) {
					baseUtil.setLayerParam(layero,data);
				}
			});
		}
	    
	    /**
		 * 编辑弹窗（编辑页面）
		 */
	    editOperation(data){
	    	var that = this;
			layer.open({
	    		btnAlign: 'c',
				type : 2,
				title : "编辑",
				content : editUrl+that.editHtml,
				maxmin : !0,
				area : that.getArea(),
				btn : [ "确定","取消" ],
				yes : function(index, layero) {
					var submit = layero.find('iframe').contents().find(".layerCard button[lay-submit]");
		            submit.trigger('click');
		            table.reload(that.tableId);
				},
				btn2 : function(index, layero){
					layer.close(index);
				},
				success : function(layero, index) {
					baseUtil.setLayerParam(layero,data);
				}
			});
		}
	    
	    /**
		 * 单个删除操作
		 */
	    delOperation(checkData){
	    	var that = this;
	    	var param = "";
	    	var idCodeArray = that.idCode;
			for(var j=0; j<idCodeArray.length; j++){
				param = param + checkData[idCodeArray[j].field];
				if(j!=(idCodeArray.length-1)){
					param = param + "|";
				}
			}
	    	layer.confirm("确定删除？",function(index){
	    		that.delAjax(param);
	    	});
		}
	    
		/**
		 * 删除Ajax
		 * param : 数组格式[]，参数
		 */
		delAjax(param) {
			var that = this;
			var dataUrl = that.delUrl;
			
			var _ajaxTypeStr = "POST";
			var _ajaxAsyncFlag = false;
			var _ajaxUrlStr = dataUrl;
			var _ajaxDataObj = {ids:param};
			var _ajaxDataTypeStr = "json";
			var _ajaxErrorMsgStr = "删除失败";
			baseUtil.ajax(_ajaxTypeStr,_ajaxAsyncFlag,_ajaxUrlStr,_ajaxDataObj,_ajaxDataTypeStr,_ajaxErrorMsgStr,function(result){
				if(!baseUtil.isNullOrEmpty(result)){
					if(result.success){
						layer.msg(result.msg);
//						that.reload();
						table.reload(that.tableId);
					}else{
						if(result.msg != null && result.msg != ""){
							layer.msg(result.msg);
						}else{							
							layer.msg("返回结果success=false,请重试或者联系管理员！");
						}
					}
				}else{
					layer.msg("基础调用方法数据加载出错，baseUtil.ajaxAdmin");
				}
			});
		}
	    
		/**
		 * 搜索
		 */
		searchSearch(searchData) { // 验证是否全选
				var that = this;
				table.reload(that.tableId,{
					url : that.dataUrl
			        ,where:searchData.field
			     });
			};
	   
	    /**
		 * 表格刷新
		 */
	    reload(params){
	    	var that = this;
	    	table.reload(that.tableId,{
	    		url : that.dataUrl
	    		,where: baseUtil.isNullOrEmpty(params)?'':params.where
	    	})
	    }

		/**
		 * 继承上次查询条件的表格刷新
		 */
	    reload2(){
	    	table.reload(this.tableId);
		}

	    // 获取并加载表格行列
		getTableTitle(tableClassObj) {
			var that = this;
			var dataUrl = tableClassObj.tableTitleUrl;

			var _ajaxTypeStr = "GET";
			var _ajaxAsyncFlag = false;
			var _ajaxUrlStr = dataUrl;
			var _ajaxDataObj = {};
			var _ajaxDataTypeStr = "json";
			var _ajaxErrorMsgStr = "正在建设中";
			var result = baseUtil.ajax(_ajaxTypeStr,_ajaxAsyncFlag,_ajaxUrlStr,_ajaxDataObj,_ajaxDataTypeStr,_ajaxErrorMsgStr);
			that.dataUrlResult = result;
			if(!baseUtil.isNullOrEmpty(result)){
				var returnTitle = new Array();
				//处理idcode的数据
				that.idCode = result.primaryKey;
				var dataObj = result.data;//表头数据
				var operationBtnData = result.operationBtn;//操作列按钮
				var toolbarData = result.toolbar;//工具栏数据
				
				// 获取表头 只显示shownum大于0的列，防止shownum不连续，用临时数组转换了一下
				var returnTitleTemp = new Array();
				for(var i=0; i<dataObj.length; i++){
					if(dataObj[i].shownum&&dataObj[i].shownum>0){
						if(dataObj[i].field=="_xzl"){
							returnTitleTemp[dataObj[i].shownum-1]={type:'checkbox',width:dataObj[i].width, fixed:dataObj[i].fixed};
						}else if(dataObj[i].field=="_czl"){
							returnTitleTemp[dataObj[i].shownum-1]={width:dataObj[i].width, title:dataObj[i].title, align:'center', toolbar:'#'+tableClassObj.operationBtn, fixed:dataObj[i].fixed};
							// 添加删、改、查按钮
							if(!baseUtil.isNullOrEmpty(operationBtnData) && operationBtnData.length > 0){
								that.createOperationBtn(tableClassObj,operationBtnData);// 组建操作btn
							}
						}else{
							returnTitleTemp[dataObj[i].shownum-1]=dataObj[i];
						}
					}
				}
				for(var i=0; i<returnTitleTemp.length; i++){
					if(returnTitleTemp[i]){
						returnTitle.push(returnTitleTemp[i]);
					}
					
				}
				
				//页面创建工具栏
				if(!baseUtil.isNullOrEmpty(toolbarData) && tableClassObj.hasToolbar && toolbarData.length > 0){
					that.createToolBar(tableClassObj,toolbarData)
				}
				//创建查询条件
				that.createSearchForm(tableClassObj,dataObj);
				//创建工具条和table之间的页面提示
				that.createToolbarappend(result.toolbarappend,result.toolbarurl);
				//创建工具条和table之间的页面提示
				that.createTabletopappend(result.tabletopappend,result.tabletopurl);
			}
			var newreturnTitle = JSON.parse(JSON.stringify(returnTitle)) ;
			
			newreturnTitle.map(function(item){
				
				if(baseUtil.isNullOrEmpty(item.toolbar)){
					item.templet=function(ds){
						for (var key in ds){
							if(key.indexOf('sf')===0){
								if(ds[key]=='Y'){
									return '是'
								}else{
									return '否'
								}
							};
						   
						}
					}
				}
			})
			
			
			return returnTitle;
		};
		
		/**
		 * 加载表格数据
		 * 满屏调整：
		 * 		没有搜索条件：full-63
		 * 		当只有一行搜索条件：full-135
		 * 		两行：full-175
		 * 		三行：220
		 * @params titleData   [ {field: 'yjsjbxxid',type:'checkbox', title: '序号', width: 80}....]
		 */
		loadTable(tableId,titleData,dataUrl,whereData) {
			var $data = null;
			if(typeof(whereData)=='function'){
				$data = whereData();
			}else{
				$data = whereData;
			}
			
			dataUrl = dataUrl+"&_accessToken="+_accessToken;
			var that = this;
			var titleArr = new Array();
			titleArr.push(titleData);
			table.render({
				elem : "#"+tableId,//表格id
				url  : dataUrl,//列表数据连接
				cols : titleArr,//表头数据
				height: 'full-220',//页面自动调整满屏
				cellMinWidth: 80,
				page : true,
				limits: [10,20,50,100,200,500],
            	limit: 10,
            	where:$data
			});
		}
		/**
		 * 加载表格数据(通过data的数据加载表格)
		 * @params tableId 表格的id
		 * @params titleData    [ {field: 'yjsjbxxid',type:'checkbox', title: '序号', width: 80}....]
		 * @params data [{'yjsjbxxid':'11',{}......}] //对应表头
		 * @params isPage false/true 是否分页
		 */
		loadTableByData(tableId,titleData,data,isPage){
			var titleArr = new Array();
			titleArr.push(titleData);
			var tableIns = table.render({
			    elem: '#'+tableId,
		    	cols: titleArr,
		    	data: data,
		    	cellMinWidth: 80,
				page : isPage,
				limits: [10,20,50,100,200,500],
            	limit: isPage?10:500
		    });
			return tableIns;
		}
		/**
		 * 加载树表格数据
		 * 满屏调整：
		 * 		没有搜索条件：full-63
		 * 		当只有一行搜索条件：full-135
		 * 		两行：full-175
		 * 		三行：220
		 */
		loadTreeTable(tableClazz,titleData) {
			var that = this;
			layui.use(['treeGrid'],function(){
				treeGrid = layui.treeGrid;
				var titleArr = new Array();
				titleArr.push(titleData);
				var treeTable =treeGrid.render({
					elem : "#"+tableClazz.tableId,//表格id
					url : tableClazz.dataUrl,//列表数据连接
					cellMinWidth: 100,
					treeId : tableClazz.treeId,//树形id字段名称
					treeParentId : tableClazz.treeParentId,//树形父id字段名称
					treeShowName : tableClazz.treeShowName,//以树形式显示的字段
					cols : titleArr,//表头数据
					page:false
				});
			});
		}
		
		
		/**
		 * 组建操作btn
		 * 如果页面有自己的特殊处理数据，该方法可以重写在自己的页面js中
		 */
		createOperationBtn(tableClassObj,operationBtnData){
			var that = this;
			var html='';
			for(var i=0; i<operationBtnData.length; i++){
				var operationBtnHtml = "<a class='layui-btn layui-btn-xs {clazz}' lay-event='{code}'>{name}</a>";
				operationBtnHtml = operationBtnHtml.replace(/\{clazz\}/g,operationBtnData[i].clazz)
									.replace(/\{code\}/g,operationBtnData[i].code)
									.replace(/\{name\}/g,operationBtnData[i].name);
				operationBtnHtml = '{{# if (!(d._operationBtnStatus&&d._operationBtnStatus["'+operationBtnData[i].code+'"]&&d._operationBtnStatus["'+operationBtnData[i].code+'"]["status"] =="notshow")){}} '+operationBtnHtml+' {{#}}}';
				html+=operationBtnHtml				
			}
			$("#"+tableClassObj.operationBtn).text(html);
		};
		
		/**
		 * 生成toolbar
		 * 如果页面有自己的特殊方法，该方法可以重写在自己的页面js中
		 */
		createToolBar(tableClassObj,toolbarData){
			var that = this;
			for(var i=0; i<toolbarData.length; i++){
				var toolbarHtml = '<button class="layui-btn {clazz}" data-type="{code}"><i class="layui-icon">{icon}</i>{name}</button>';
				toolbarHtml = toolbarHtml.replace(/\{clazz\}/g,baseUtil.isNullOrEmpty(toolbarData[i].clazz)? 'layui-btn-sm':(toolbarData[i].clazz)).replace(/\{code\}/g,toolbarData[i].code)
									.replace(/\{icon\}/g,baseUtil.isNullOrEmpty(toolbarData[i].icon)? '':(toolbarData[i].icon+";"))
									.replace(/\{name\}/g,toolbarData[i].name);
				$("#"+tableClassObj.toolbarId).append(toolbarHtml);
			}
		};
		
		/**
		 * 生成查询条件对应的内容
		 */
	    createSearchForm(tableClassObj,dataObj){
	    	var returnTitleTemp = new Array();
			// 先将数组通过查询序号进行排序
			dataObj.sort(baseUtil.compare("searchnum",true));

			for(var i=0; i<dataObj.length; i++){
				if(dataObj[i].searchnum&&dataObj[i].searchnum>0){
					if(dataObj[i].field.substring(0,1)=="_"){
						continue;
					}else{
						// returnTitleTemp[dataObj[i].searchnum-1]=dataObj[i];
						returnTitleTemp.push(dataObj[i]);
					}
				}
			}
	    	var formStr = '';
//	    	formStr+='<div class="layui-inline">';
//	    	formStr+='		<button class="layui-btn" type="button" lay-filter="search" lay-submit data-type="search" id="search_set">查询设置</button>';
//	    	formStr+='</div>';
	    	for(var i=0; i<returnTitleTemp.length; i++){
				if(returnTitleTemp[i] && 'qujian' != returnTitleTemp[i].operationtype){
					formStr+='<div class="layui-inline">';
			    	formStr+='	<label class="layui-form-mid">'+returnTitleTemp[i].title+'</label>';
			    	formStr+='	<div class="layui-input-inline" style="width: 150px;">';
			    	if(returnTitleTemp[i].edittype=="select"){
			    		formStr+='		<select name="'+returnTitleTemp[i].field+'" id="'+returnTitleTemp[i].field+'_'+tableClassObj.searchId+'" lay-filter="'+returnTitleTemp[i].field+'_'+tableClassObj.searchId+'" lay-search></select>';
			    	}else if(returnTitleTemp[i].edittype=="formselects"){
			    		formStr+='		<select name="'+returnTitleTemp[i].field+'" id="'+returnTitleTemp[i].field+'_'+tableClassObj.searchId+'" xm-select="'+returnTitleTemp[i].field+'_'+tableClassObj.searchId+'" xm-select-max="'+returnTitleTemp[i].formattype.selectmax+'" lay-filter="'+returnTitleTemp[i].field+'_'+tableClassObj.searchId+'" lay-search></select>';
			    	}else if(returnTitleTemp[i].edittype=="checkbox"){
			    		formStr+='		<input type="checkbox" lay-filter="zwebcheckbox1" name="'+returnTitleTemp[i].field+'" id="'+returnTitleTemp[i].field+'_'+tableClassObj.searchId+'" title="'+returnTitleTemp[i].title+'" value="Y" >';
			    	}else{
			    		formStr+='		<input type="text" class="layui-input layui-input-sm" name="'+returnTitleTemp[i].field+'" id="'+returnTitleTemp[i].field+'_'+tableClassObj.searchId+'" autocomplete="off">';
			    	}
			    	formStr+='	</div>';
			    	formStr+='</div>';
				}else if (returnTitleTemp[i] && 'qujian' == returnTitleTemp[i].operationtype){
					// 区间
					formStr+='<div class="layui-inline">';
			    	if(returnTitleTemp[i].edittype=="date"){
			    		formStr+='	<label class="layui-form-mid">'+returnTitleTemp[i].title+'</label>';
			    		formStr+='	<div class="layui-input-inline" style="width: 150px;">';
			    		formStr+='		<input type="text" class="layui-input layui-input-sm" name="_ks'+returnTitleTemp[i].field+'" id="_ks'+returnTitleTemp[i].field+'_'+tableClassObj.searchId+'" autocomplete="off">';
			    		formStr+='	</div>';
			    		formStr+='	<div class="layui-form-mid">-</div>';
			    		formStr+='	<div class="layui-input-inline" style="width: 150px;">';
			    		formStr+='		<input type="text" class="layui-input layui-input-sm" name="_js'+returnTitleTemp[i].field+'" id="_js'+returnTitleTemp[i].field+'_'+tableClassObj.searchId+'" autocomplete="off">';
			    		formStr+='	</div>';
			    	}
			    	formStr+='</div>';
				}
			}
	    	//此处id使用的search 如果页面有多个searchform的时候 应该使用 tableClassObj.searchId变量替换
	    	formStr+='<div class="layui-inline">';
	    	formStr+='	<div class="layui-input-inline">';
	    	formStr+='		<button class="layui-btn" type="button" lay-filter="search" lay-submit data-type="search" id="search_submit">查询</button>';
	    	//formStr+='		<button class="layui-btn" type="button" lay-filter="search" lay-submit data-type="search" id="search_set">查询设置</button>';
	    	formStr+='	</div>';
	    	formStr+='</div>';
	    	$("#"+tableClassObj.searchId).html('');
			$("#"+tableClassObj.searchId).append(formStr);
	    	
	    	var selectObj = {};
	    	selectObj.flag = false;
	    	var dateObj = {};
	    	dateObj.flag = false;
	    	var checkboxObj = {};
	    	checkboxObj.flag = false;
	    	var formselectsObj = {};
	    	formselectsObj.flag = false;
	    	for(var i=0; i<returnTitleTemp.length; i++){
				if(returnTitleTemp[i]){
					if(returnTitleTemp[i].edittype=="select"){
						selectObj.fields = '';
						selectObj.bmbhs = '';
						selectObj.fields += returnTitleTemp[i].field+"_"+tableClassObj.searchId+",";
						if(!returnTitleTemp[i].formattype) continue;
						selectObj.bmbhs += returnTitleTemp[i].formattype.bmbh+",";
						selectObj.flag = true;
						
						if(!baseUtil.isNullOrEmpty(returnTitleTemp[i].formattype.ssbmbhfield)){
							var selectId = returnTitleTemp[i].field+"_"+tableClassObj.searchId;
							var selectSsbmId = returnTitleTemp[i].formattype.ssbmbhfield+"_"+tableClassObj.searchId;
							var selectBmbh = returnTitleTemp[i].formattype.bmbh;
							var selectSsbmBmbh = returnTitleTemp[i].formattype.ssbmbh;
							form.on('select('+selectSsbmId+')', function(data){
								baseUtil.loadSelectBySsbmbhAndSsmxbh(selectId,selectBmbh,selectSsbmBmbh,$('#'+selectId+'').val(),$('#'+selectSsbmId+'').val(),form);
							});
						}
			    	}else if(returnTitleTemp[i].edittype=="date"){
			    		var types = "date";
			    		if(returnTitleTemp[i].formattype.datetype=="yyyy"){
			    			types = "year";
			    		}else if(returnTitleTemp[i].formattype.datetype=="yyyyMM" || returnTitleTemp[i].formattype.datetype=="yyyy-MM"){
			    			types = "month";
			    		}else if(returnTitleTemp[i].formattype.datetype=="yyyyMMdd" || returnTitleTemp[i].formattype.datetype=="yyyy-MM-dd"){
			    			types = "date";
			    		}else if (returnTitleTemp[i].formattype.datetype=="yyyyMMddHHmmss" || returnTitleTemp[i].formattype.datetype=="yyyy-MM-dd HH:mm:ss"){
							types = "datetime";
						}else if (returnTitleTemp[i].formattype.datetype=="HHmmss" || returnTitleTemp[i].formattype.datetype=="HH:mm:ss"){
							types = "time";
						}

			    		dateObj.fields = '';// 字段名
			    		dateObj.formats = '';// 时间格式
			    		dateObj.types = '';// 字段类型
		    			// 区间情况下,添加开始结束字段
		    			if('qujian' == returnTitleTemp[i].operationtype){
		    				dateObj.fields += "_ks"+returnTitleTemp[i].field+"_"+tableClassObj.searchId+",";
		    				dateObj.formats += returnTitleTemp[i].formattype.datetype+",";
		    				dateObj.types += types+",";
		    				dateObj.fields += "_js"+returnTitleTemp[i].field+"_"+tableClassObj.searchId+",";
		    				dateObj.formats += returnTitleTemp[i].formattype.datetype+",";
		    				dateObj.types += types+",";
		    			}else{
		    				dateObj.fields += returnTitleTemp[i].field+"_"+tableClassObj.searchId+",";
		    				dateObj.formats += returnTitleTemp[i].formattype.datetype+",";
		    				dateObj.types += types+",";
		    			}
		    			
		    			dateObj.flag = true;
		    			
			    	}else if(returnTitleTemp[i].edittype=="checkbox"){
			    		checkboxObj.flag = true;
			    	}else if(returnTitleTemp[i].edittype=="formselects"){
			    		formselectsObj.fields = '';
			    		formselectsObj.bmbhs = '';
			    		formselectsObj.fields += returnTitleTemp[i].field+"_"+tableClassObj.searchId+",";
			    		formselectsObj.bmbhs += returnTitleTemp[i].formattype.bmbh+",";
			    		formselectsObj.flag = true;
						formSelects.on(selectId,function(id, vals, val, isAdd, isDisabled){
							baseUtil.setFormSelectText(id, vals, val, isAdd, isDisabled);
						});
			    		
			    	}
				}
				if(selectObj.flag){
					selectObj.bmbhs = selectObj.bmbhs.substring(0,selectObj.bmbhs.length-1);
					selectObj.fields = selectObj.fields.substring(0,selectObj.fields.length-1);
					baseUtil.loadSelect(selectObj.fields,selectObj.bmbhs,form);
				}
				if(formselectsObj.flag){
					formselectsObj.bmbhs = formselectsObj.bmbhs.substring(0,formselectsObj.bmbhs.length-1);
					formselectsObj.fields = formselectsObj.fields.substring(0,formselectsObj.fields.length-1);
					baseUtil.loadFormSelects(formselectsObj.fields,formselectsObj.bmbhs,formSelects);
				}
				if(dateObj.flag){
					dateObj.fields = dateObj.fields.substring(0,dateObj.fields.length-1);
					dateObj.types = dateObj.types.substring(0,dateObj.types.length-1);
					dateObj.formats = dateObj.formats.substring(0,dateObj.formats.length-1);
					baseUtil.loadDate(dateObj.fields,dateObj.types,dateObj.formats,laydate);
				}
				if(checkboxObj.flag){
					baseUtil.loadCheckbox(form);
				}
			}
	    }
	    /**
	     * 设置工具条和table表单之间的页面提示语
	     */
	    createToolbarappend(toolbarappend,toolbarurl){
	    	if(!baseUtil.isNullOrEmpty(toolbarappend)){
	    		$("#toolbarappend").append(toolbarappend);
	    	}else if(!baseUtil.isNullOrEmpty(toolbarurl)){
	    		$("#toolbarappend").load(toolbarurl);
	    	}else{
	    		$("#toolbarappend").css('display','none');
	    	}
	    }
	    /**
	     * 设置工具条和table表单之间的页面提示语
	     */
	    createTabletopappend(tabletopappend,tabletopurl){
	    	if(!baseUtil.isNullOrEmpty(tabletopappend)){
	    		$("#tabletopappend").append(tabletopappend);
	    	}else if(!baseUtil.isNullOrEmpty(tabletopurl)){
	    		$("#tabletopappend").load(tabletopurl);
	    	}else{
	    		$("#tabletopappend").css('display','none');
	    	}
	    }
	    /**
	     * 返回已选择行的数据
	     */
	    getCheckedData() {
            var checkStatus = table.checkStatus(this.tableId);
            var checkboxdatas = checkStatus.data;
            return checkboxdatas;
        }
	}
	// 核心入口
	var autotable = new AutoTable();
	exports("autotable", autotable);
});
