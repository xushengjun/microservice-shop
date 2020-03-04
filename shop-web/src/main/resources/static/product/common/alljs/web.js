	/***************************通用的js变量 开始***************************************/
	//示例 http://127.0.0.1:80/web/view/sys/entity/entityItemshow.html
	//wl = windowLocation
	var pageversion = 3;
	var pageweb = "/web";
//	console.log("web.js_window.location.href="+window.location.href);
//	console.log("web.js_window.location.search="+window.location.search);
	var wlProtocol = window.location.protocol+"//";//示例 http://
	var wlHost = window.location.hostname;//示例 127.0.0.1
	var wlPort = window.location.port;//示例 80
	if(wlPort!=""){
		wlPort = ":"+wlPort;
	}
	var wlPathArray = window.location.pathname.substring(1).split("/");//示例 web/view/sys/entity/entityItemshow.html
	var wlWeb = "/"+wlPathArray[0];//示例 /web

	var listUrl = '';
	var editUrl = '';
	var viewUrl = '';
	var https = wlProtocol + wlHost;
	//示例http://127.0.0.1/web/view/yjs/yy/dm/gg/qggxdm/ybgshyjysblist.html?modurl=/view/yjs/yy/dm/gg/bkzydm/bkzydmlist.html
	//如果有modurl就有modurl的pathname
	var wlSearch = window.location.search;
	var wlSearchArr = wlSearch.substring(1).split("&");
	if(wlSearchArr&&wlSearchArr.length>0&&wlSearchArr[0].indexOf('modurl')>=0){
		var modurl = (wlSearchArr[0].split('='))[1];
		wlPathArray = modurl.split("/");
	}
	//调用前端使用的变量
	var wlModuleWeb = "/"+wlPathArray[1];//示例 /view
	var wlModulePathWeb = "";//示例 /sys/entity
	for(var i=2;i<wlPathArray.length-1;i++){
		wlModulePathWeb += "/"+wlPathArray[i];
	}
	if(wlSearchArr&&wlSearchArr.length>0&&wlSearchArr[0].indexOf('modurl')>=0){
		listUrl = wlProtocol+wlHost+wlPort+wlWeb+'/view/template/list.html?modurl='+wlModuleWeb+wlModulePathWeb+'/';
		editUrl = wlProtocol+wlHost+wlPort+wlWeb+'/view/template/edit.html?modurl='+wlModuleWeb+wlModulePathWeb+'/';
		viewUrl = wlProtocol+wlHost+wlPort+wlWeb+'/view/template/view.html?modurl='+wlModuleWeb+wlModulePathWeb+'/';
	}
	//layui.config中使用
	//layui.extend中使用 {/}的意思即代表采用自有路径，即不跟随 base 路径
	var basePath = "/static/layuiadmin/";
	var indexPath = '{/}'+wlProtocol+wlHost+wlPort+'/static/layuiadmin/lib/index';;
	//调用后台使用的js变量
	var wlModuleSys = "/"+wlPathArray[2];//示例 /sys
	var wlModulePathSys = "";//示例 /entity
	for(var i=3;i<wlPathArray.length-1;i++){
		wlModulePathSys += "/"+wlPathArray[i];
	}
	var wlModuleSysUrl = wlWeb+wlModuleSys+"?_service="+wlModulePathSys+"/";
	/**
	 * HL 20181207 添加三个链接，仅用于导入、导出、下载导入模板
	 */
	var wlModuleSysToImportModel = wlWeb+wlModuleSys +"/importModel?_service="+wlModulePathSys+"/";//下载导入模板
	var wlModuleSysToImport = wlWeb+wlModuleSys +"/import?_service="+wlModulePathSys+"/";//导入
	var wlModuleSysToDerived = wlWeb+wlModuleSys +"/export?_service="+wlModulePathSys+"/";//导出
	/**
	 * 2019-07-02 用于下载文件
	 */
	var wlModuleSysToDownloadFile = wlWeb+wlModuleSys +"/downloadfile?_service="+wlModulePathSys+"/";//下载文件
	/***************************通用的js变量 结束***************************************/

	/***************************sys 微服务中定义的js变量 开始***************************************/
	//用户信息
	var baseUserInfoUrl = wlWeb+"/sys/user/info?1=1";
	function wlUserInfoUrl(){
		return baseUserInfoUrl;
	}
	//文件上传调用的路径
	var baseFileUploadUrl = wlWeb+"/sys/fileupload?1=1";
	function wlFileUploadUrl(_filetype,_refid,_reftype){
		if(!_reftype){//默认是不删除以前的文件，重新上传 delete 删除  undelete 不删除
			_reftype = "undelete";
		}
		return baseFileUploadUrl+"&_filetype="+_filetype+"&_refid="+_refid+"&_reftype="+_reftype;
	}
	//文件下载调用的路径 查看调用的路径
	var baseFileDownUrl = wlWeb+"/sys/filedown?1=1";
	function wlFileDownByFiletypeAndRefidUrl(_filetype,_refid){
		return wlProtocol+wlHost+wlPort+baseFileDownUrl+"&_filetype="+_filetype+"&_refid="+_refid;
	}
	function wlFileViewByFiletypeAndRefidUrl(_filetype,_refid){
		return wlProtocol+wlHost+wlPort+baseFileDownUrl+"&_filetype="+_filetype+"&_refid="+_refid+"&_fileview=true";
	}
	function wlFileDownByFileidUrl(_fileid){
		return wlProtocol+wlHost+wlPort+baseFileDownUrl+"&_fileid="+_fileid;
	}
	function wlFileViewByFileidUrl(_fileid){
		return wlProtocol+wlHost+wlPort+baseFileDownUrl+"&_fileid="+_fileid+"&_fileview=true";
	}
	/**
	 * 查看工作流图片url
	 * @param _fileid
	 * @param _filetype
	 * @returns
	 */
	function wlProcessecFileViewByFileidUrl(_fileid,_filetype){
		return wlWeb+"/sys/fileShowActivitiImage?_fileid="+_fileid+"&_filetype="+_filetype;
	}
	//文件删除调用的路径
	var baseFileDeleteUrl = wlWeb+"/sys/filedelete?1=1";
	function wlFileDeleteByFileidUrl(_fileid){
		return wlProtocol+wlHost+wlPort+baseFileDeleteUrl+"&_fileid="+_fileid;
	}
	//加载文件信息
	var baseFileByFiletypeAndRefidUrl = wlWeb+"/sys?_service=/file/queryByRefid";
	function wlFileByFiletypeAndRefidUrl(filetype,refid){
		return wlProtocol+wlHost+wlPort+baseFileByFiletypeAndRefidUrl+"&filetype="+filetype+"&refid="+refid;
	}

	//加载编码调用的url
	//示例 wlBianMaUrl = http://localhost/web/sys?_service=/code/codeItem/queryByBmbh&bmbh=test,feng,user-post
	var baseBianMaUrl = wlWeb+"/sys?_service=/code/codeItem/queryByBmbh";
	function wlBianMaUrl(bmbh){
		return baseBianMaUrl+"&bmbh="+bmbh;
	}
	//加载语言调用的url localhost/web/sys/getLanguageList
	var wlYuyanUrl = wlWeb+"/sys/getLanguageList";
	//设置语言调用的url http://localhost/web/sys/setLanguage?_userLanguage=ko_KR
	var wlSzYuyanUrl = wlWeb+"/sys/setLanguage?_userLanguage=";
	/***************************sys 微服务中定义的js变量 结束***************************************/

	// 页面禁用回车键提交页面
	document.onkeydown = function (event) {
		if(document.activeElement.nodeName=='TEXTAREA'){
			return true
		}else{
	        var e = event || window.event;
	        if (e && e.keyCode == 13) { //回车键的键值为13
	            return false;
	        }
		}

    };


    var width = window.screen.width
    if(width<1500){
    	var style = document.createElement("style");
    	style.type = "text/css";
    	style.innerHTML=".layui-container{width:100% !important;zoom:0.8; }";
    	setTimeout(function(){
    		var domm = document.getElementsByTagName('body')[0]
        	domm.appendChild(style);
    	},100)
    }