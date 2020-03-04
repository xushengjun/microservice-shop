layui.define(['form','jquery'],function(exports){
	var layuiform = layui.form;
	var $ = layui.$;
	var layer = layui.layer;
	//构造
	var layuiXtree = function(options) {
	    var that = this;
	    that._containerid = options.elem;
	    that._container = document.getElementById(options.elem); //容器
	    that._container.style.minHeight = "100px";//最小高度
	    if (typeof (options.data) == 'object') {
	        that._dataJson = options.data;
	    }
	    that._options = options;
	    that._ischeckbox = options.ischeckbox == true ? "checkbox":"radio";//checkbox||radio
	    that.Loading(options);
	}
	
	//加载特效，且获取数据
	layuiXtree.prototype.Loading = function (options) {
	    var that = this;
	    that.xloading = document.createElement("span"); //创建加载对象
	    that.xloading.setAttribute('class', 'layui-icon layui-anim layui-anim-rotate layui-anim-loop');
	    that.xloading.innerHTML = '&#xe63e;';
	    that.xloading.style.fontSize = "50px";
	    that.xloading.style.color = "#009688";
	    that.xloading.style.fontWeight = "bold";
	    that.xloading.style.marginLeft = that._container.offsetWidth / 2 - 25 + 'px';
	    that.xloading.style.marginTop = that._container.offsetHeight / 2 - 50 + 'px';
	    that._container.innerHTML = '';
	    that._container.appendChild(that.xloading); //加载显示
	    if (typeof (options.data) == 'object') {
	        that.Initial(options);
	       
	    }else{
	    	$.ajax({
				url : options.data,
				dataType : "json",
				success : function(data, status) {
					if(data.success){
						that._dataJson = data.obj;
						that.Initial(options);
					}
				},
				error : function() {
					layer.msg("树加载失败");
				}
			});
	    }
	    
	    //如果是字符串url，进行异步加载
//	    var obj = new XMLHttpRequest();
//	    obj.open('get', options.data, true);
//	    obj.onreadystatechange = function () {
//	        if (obj.readyState == 4 && obj.status == 200 || obj.status == 304) { //回调成功
//	            that._dataJson = eval('(' + obj.responseText + ')'); //将返回的数据转为json
//	            that.Initial(options);
//	        }
//	    };
//	    obj.send();
	}
	
	//data验证后的数据初始化
	layuiXtree.prototype.Initial = function (options) {
	    var that = this;
	    that._form = layuiform; //layui from对象
	    that._domStr = "";  //结构字符串
	    that._isopen = options.isopen != null ? options.isopen : true;
	    if (options.color == null) options.color = { open: '#2F4056', close: '#2F4056', end: '#2F4056' };//图标颜色
	    that._iconOpenColor = options.color.open != null ? options.color.open : "#2F4056";
	    that._iconCloseColor = options.color.close != null ? options.color.close : "#2F4056";
	    that._iconEndColor = options.color.end != null ? options.color.end : "#2F4056";
	    if (options.icon == null) options.icon = { open: '&#xe625;', close: '&#xe623;', end: '&#xe621;' };//图标样式
	    that._iconOpen = options.icon.open != null ? options.icon.open : '&#xe625;';
	    that._iconClose = options.icon.close != null ? options.icon.close : '&#xe623;';
	    that._iconEnd = options.icon.end != null ? options.icon.end : '&#xe621;';
	    that._click = options.click != null ? options.click : function () { };//点击事件
	    that._ckall = options.ckall != null ? options.ckall : false;  //全选是否启用
	    that._ckallSuccess = options.ckallback != null ? options.ckallback : function () { };//全选回调
	    if(that._ischeckbox == "radio"){
	    	that.dataBindRadio(that._dataJson);//生成结构（多选）
	    	that.radioRendering();
	    }else{
	    	that.CreateCkAll();//创建全选框div
		    that.dataBindCheckbox(that._dataJson);//生成结构（多选）
		    that.checkboxRendering();
	    }
	    
	}
	
	//全选框
	layuiXtree.prototype.CreateCkAll = function () {
	    var that = this;
	    if (that._ckall) {
	        that._domStr += '<div class="layui-xtree-item">';
	        that._domStr += '<input type="checkbox" class="layui-xtree-checkbox layui-xtree-ckall" title="全选" lay-skin="primary" lay-filter="xtreeckall' + that._containerid + '">';
	        that._domStr += '</div>';
	    }
	}
	
	//生产结构(checkbox)
	layuiXtree.prototype.dataBindCheckbox = function (d) {
	    var that = this;
	    for (var i = 0; null != d && i < d.length; i++) {
	    	var xtree_isend = '';//是否最后一级节点
	    	var xtree_ischecked = '';
	    	var xtree_isdisabled = d[i].disabled ? ' disabled="disabled" ' : '';
	    	that._domStr += '<div class="layui-xtree-item">';
	    	if (null != d[i].children && d[i].children.length > 0)
	    		that._domStr += '<i class="layui-icon layui-xtree-icon" data-xtree="' + (that._isopen ? '1' : '0') + '">' + (that._isopen ? that._iconOpen : that._iconClose) + '</i>';
	    	else {
	    		that._domStr += '<i class="layui-icon layui-xtree-icon-null">' + that._iconEnd + '</i>';
	    		xtree_isend = 'data-xend="1"';
	    		xtree_ischecked = d[i].checked ? ' checked ' : '';
	    		xtree_isdisabled = d[i].disabled ? ' disabled="disabled" ' : '';
	    	}
	    	that._domStr += '<input type="checkbox" class="layui-xtree-checkbox" ' + xtree_isend + xtree_ischecked + xtree_isdisabled + ' value="' + d[i].id + '" title="' + d[i].name + '" lay-skin="primary" lay-filter="xtreeck' + that._containerid + '">';
	    	that.dataBindCheckbox(d[i].children);
	    	that._domStr += '</div>';
	    }
	}
	
	
	//渲染呈现
	layuiXtree.prototype.checkboxRendering = function () {
	    var that = this;
	    that._container.innerHTML = that._domStr;
	    that._domStr = "";

	    //检查选中状态
	    var xtree_ckitems = that.getByClassName('layui-xtree-checkbox');
	    for (var i = 0; i < xtree_ckitems.length; i++) {
	        if (xtree_ckitems[i].getAttribute('data-xend') == '1' && xtree_ckitems[i].checked) {
	            that.ParentCheckboxChecked(xtree_ckitems[i]);
	        }
	    }

	    that._form.render('checkbox'); //layui渲染

	    var xtree_items = that.getByClassName('layui-xtree-item');
	    var xtree_icons = that.getByClassName('layui-xtree-icon');
	    var xtree_nullicons = that.getByClassName('layui-xtree-icon-null');

	    for (var i = 0; i < xtree_items.length; i++) {
	        if (xtree_items[i].parentNode == that._container)
	            xtree_items[i].style.margin = '5px 0 0 10px';
	        else {
	            xtree_items[i].style.margin = '5px 0 0 45px';
	            if (!that._isopen) xtree_items[i].style.display = 'none';
	        }
	    }

	    for (var i = 0; i < xtree_icons.length; i++) {
	        xtree_icons[i].style.position = "relative";
	        xtree_icons[i].style.top = "3px";
	        xtree_icons[i].style.margin = "0 5px 0 0";
	        xtree_icons[i].style.fontSize = "18px";
	        xtree_icons[i].style.color = that._isopen ? that._iconOpenColor : that._iconCloseColor;
	        xtree_icons[i].style.cursor = "pointer";

	        xtree_icons[i].onclick = function () {
	            var xtree_chi = this.parentNode.childNodes;
	            if (this.getAttribute('data-xtree') == 1) {
	                for (var j = 0; j < xtree_chi.length; j++) {
	                    if (xtree_chi[j].getAttribute('class') == 'layui-xtree-item')
	                        xtree_chi[j].style.display = 'none';
	                }
	                this.setAttribute('data-xtree', '0')
	                this.innerHTML = that._iconClose;
	                this.style.color = that._iconCloseColor;
	            } else {
	                for (var j = 0; j < xtree_chi.length; j++) {
	                    if (xtree_chi[j].getAttribute('class') == 'layui-xtree-item')
	                        xtree_chi[j].style.display = 'block';
	                }
	                this.setAttribute('data-xtree', '1')
	                this.innerHTML = that._iconOpen;
	                this.style.color = that._iconOpenColor;
	            }
	        }
	    }

	    for (var i = 0; i < xtree_nullicons.length; i++) {
	        xtree_nullicons[i].style.position = "relative";
	        xtree_nullicons[i].style.top = "3px";
	        xtree_nullicons[i].style.margin = "0 5px 0 0";
	        xtree_nullicons[i].style.fontSize = "18px";
	        xtree_nullicons[i].style.color = that._iconEndColor;
	    }

	    that._form.on('checkbox(xtreeck' + that._containerid + ')', function (da) {
	        //获取当前点击复选框的容器下面的所有子级容器 
	        var xtree_chis = da.elem.parentNode.getElementsByClassName('layui-xtree-item');
	        //遍历它们，选中状态与它们的父级一致（类似全选功能）
	        for (var i = 0; i < xtree_chis.length; i++) {
	            if (!that.getChildByClassName(xtree_chis[i], 'layui-xtree-checkbox')[0].disabled) {
	                that.getChildByClassName(xtree_chis[i], 'layui-xtree-checkbox')[0].checked = da.elem.checked;
	                if (da.elem.checked) that.getChildByClassName(xtree_chis[i], 'layui-xtree-checkbox')[0].nextSibling.classList.add('layui-form-checked');
	                else that.getChildByClassName(xtree_chis[i], 'layui-xtree-checkbox')[0].nextSibling.classList.remove('layui-form-checked');
	            }
	        }
	        that.ParendCheck(da.elem);
	        that._click(da);
	    });

	    var _xtree_disableds = that.getByClassName('layui-disabled');
	    for (var i = 0; i < _xtree_disableds.length; i++) {
	        _xtree_disableds[i].getElementsByTagName('span')[0].style.color = "#B5B5B5";
	    }

	    //全选按钮
	    if (that._ckall) {
	        that._form.on('checkbox(xtreeckall' + that._containerid + ')', function (data) {
	            var xtree_allck = data.elem.parentNode.parentNode.getElementsByClassName('layui-form-checkbox');
	            for (var i = 0; i < xtree_allck.length; i++) {
	                if (xtree_allck[i].getAttribute('class').indexOf('layui-checkbox-disbaled') == -1) {
	                    if (data.elem.checked) {
	                        xtree_allck[i].classList.add('layui-form-checked');
	                    }
	                    else {
	                        xtree_allck[i].classList.remove('layui-form-checked');
	                    }
	                    xtree_allck[i].parentNode.getElementsByClassName('layui-xtree-checkbox')[0].checked = data.elem.checked;
	                }
	            }
	            that._ckallSuccess();
	        });
	    }
	}
	
	//生产结构(radio)
	layuiXtree.prototype.dataBindRadio = function (d) {
	    var that = this;
	    for (var i = 0; null != d && i < d.length; i++) {
	    	var xtree_isend = '';//是否最后一级节点
	    	var xtree_ischecked = '';
	    	var xtree_isdisabled = d[i].disabled ? ' disabled="disabled" ' : '';
	    	that._domStr += '<div class="layui-xtree-item">';
	    	if (null != d[i].children && d[i].children.length > 0)
	    		that._domStr += '<i class="layui-icon layui-xtree-icon" data-xtree="' + (that._isopen ? '1' : '0') + '">' + (that._isopen ? that._iconOpen : that._iconClose) + '</i>';
	    	else {
	    		that._domStr += '<i class="layui-icon layui-xtree-icon-null">' + that._iconEnd + '</i>';
	    		xtree_isend = 'data-xend="1"';
	    	}
	    	that._domStr += '<span class="layui-xtree-radio" ' + xtree_isend + 'name="xtreeradio" value="' + d[i].id + '"  lay-filter="xtreeck' + that._containerid + '" >'+d[i].name+'</span>'
	    	that.dataBindRadio(d[i].children);
	    	that._domStr += '</div>';
	    }
	}
	//结构渲染（radio）
	layuiXtree.prototype.radioRendering = function(){
		 var that = this;
		    that._container.innerHTML = that._domStr;
		    that._domStr = "";

		    //检查选中状态
		    var xtree_ckitems = that.getByClassName('layui-xtree-radio');
		    if(xtree_ckitems.length>0){
		    	xtree_ckitems[0].classList.add("layui-bg-gray");
		    }
		   

		    var xtree_items = that.getByClassName('layui-xtree-item');
		    var xtree_icons = that.getByClassName('layui-xtree-icon');
		    var xtree_nullicons = that.getByClassName('layui-xtree-icon-null');
		    
		    //遍历错位
		    for (var i = 0; i < xtree_items.length; i++) {
		        if (xtree_items[i].parentNode == that._container)
		            xtree_items[i].style.margin = '5px 0 0 10px';
		        else {
		            xtree_items[i].style.margin = '5px 0 0 45px';
		            if (!that._isopen) xtree_items[i].style.display = 'none';
		        }
		    }

		    for (var i = 0; i < xtree_icons.length; i++) {
		        xtree_icons[i].style.position = "relative";
		        xtree_icons[i].style.top = "3px";
		        xtree_icons[i].style.margin = "0 5px 0 0";
		        xtree_icons[i].style.fontSize = "18px";
		        xtree_icons[i].style.color = that._isopen ? that._iconOpenColor : that._iconCloseColor;
		        xtree_icons[i].style.cursor = "pointer";

		        xtree_icons[i].onclick = function () {
		            var xtree_chi = this.parentNode.childNodes;
		            if (this.getAttribute('data-xtree') == 1) {
		                for (var j = 0; j < xtree_chi.length; j++) {
		                    if (xtree_chi[j].getAttribute('class') == 'layui-xtree-item')
		                        xtree_chi[j].style.display = 'none';
		                }
		                this.setAttribute('data-xtree', '0')
		                this.innerHTML = that._iconClose;
		                this.style.color = that._iconCloseColor;
		            } else {
		                for (var j = 0; j < xtree_chi.length; j++) {
		                    if (xtree_chi[j].getAttribute('class') == 'layui-xtree-item')
		                        xtree_chi[j].style.display = 'block';
		                }
		                this.setAttribute('data-xtree', '1')
		                this.innerHTML = that._iconOpen;
		                this.style.color = that._iconOpenColor;
		            }
		        }
		    }

		    for (var i = 0; i < xtree_nullicons.length; i++) {
		        xtree_nullicons[i].style.position = "relative";
		        xtree_nullicons[i].style.top = "3px";
		        xtree_nullicons[i].style.margin = "0 5px 0 0";
		        xtree_nullicons[i].style.fontSize = "18px";
		        xtree_nullicons[i].style.color = that._iconEndColor;
		    }
		    
		    $(".layui-xtree-radio").on('click',function(){
		    	var rtndata = {};
		    	rtndata.id = $(this).attr("value");
		    	rtndata.name = $(this).text();
		    	$(".layui-xtree-radio").removeClass("layui-bg-black");
		    	$(this).addClass("layui-bg-black");
		    	that._click(rtndata);
		    })

		    //全选按钮
//		    if (that._ckall) {
//		        layer.msg("单选模式暂不支持全选。")
//		    }
	}

	//封装IE8 Class选择
	layuiXtree.prototype.getByClassName = function (cn) {
	    if (document.getElementsByClassName) return this._container.getElementsByClassName(cn);
	    var _xlist = this._container.childNodes;
	    var _xtemp = new Array();
	    for (var i = 0; i < _xlist.length; i++) {
	        var _xchild = _xlist[i];
	        var _xclassNames = _xchild.getAttribute('class').split(' ');
	        for (var j = 0; j < _xclassNames.length; j++) {
	            if (_xclassNames[j] == cn) {
	                _xtemp.push(_xchild);
	                break;
	            }
	        }
	    }
	    return _xtemp;
	}

	//在一个对象下面找子级
	layuiXtree.prototype.getChildByClassName = function (obj, cn) {
	    var _xlist = obj.childNodes;
	    var _xtemp = new Array();
	    for (var i = 0; i < _xlist.length; i++) {
	        var _xchild = _xlist[i];
	        var _xclassNames = _xchild.getAttribute('class').split(' ');
	        for (var j = 0; j < _xclassNames.length; j++) {
	            if (_xclassNames[j] == cn) {
	                _xtemp.push(_xchild);
	                break;
	            }
	        }
	    }
	    return _xtemp;
	}

	//更新渲染
	layuiXtree.prototype.render = function () {
	    var that = this;
	    that.Loading(that._options);
	}

	//子节点选中改变，父节点更改自身状态
	layuiXtree.prototype.ParendCheck = function (ckelem) {
	    var that = this;
	    var xtree_p = ckelem.parentNode.parentNode;
	    if (xtree_p.getAttribute('class') == 'layui-xtree-item') {
	        var xtree_all = that.getChildByClassName(xtree_p, 'layui-xtree-item');
	        var xtree_count = 0;

	        for (var i = 0; i < xtree_all.length; i++) {
	            if (that.getChildByClassName(xtree_all[i], 'layui-xtree-checkbox')[0].checked) {
	                xtree_count++;
	            }
	        }

	        if (xtree_count <= 0) {
	            that.getChildByClassName(xtree_p, 'layui-xtree-checkbox')[0].checked = false;
	            that.getChildByClassName(xtree_p, 'layui-xtree-checkbox')[0].nextSibling.classList.remove('layui-form-checked');
	        } else {
	            that.getChildByClassName(xtree_p, 'layui-xtree-checkbox')[0].checked = true;
	            that.getChildByClassName(xtree_p, 'layui-xtree-checkbox')[0].nextSibling.classList.add('layui-form-checked');
	        }
	        this.ParendCheck(that.getChildByClassName(xtree_p, 'layui-xtree-checkbox')[0]);
	    }
	}

	//渲染之前按照选中的末级去改变父级选中状态
	layuiXtree.prototype.ParentCheckboxChecked = function (e) {
	    var that = this;
	    if (e.parentNode.parentNode.getAttribute('class') == 'layui-xtree-item') {
	        var _pe = that.getChildByClassName(e.parentNode.parentNode, 'layui-xtree-checkbox')[0];
	        _pe.checked = true;
	        that.ParentCheckboxChecked(_pe);
	    }
	}

	//获取全部选中的末级checkbox对象
	layuiXtree.prototype.GetChecked = function () {
	    var that = this;
	    var arr = new Array();
	    var arrIndex = 0;
	    var cks = that.getByClassName('layui-xtree-checkbox');
	    for (var i = 0; i < cks.length; i++) {
	        if (cks[i].checked && cks[i].getAttribute('data-xend') == '1') {
	            arr[arrIndex] = cks[i]; arrIndex++;
	        }
	    }
	    return arr;
	}

	//获取全部的原始checkbox对象
	layuiXtree.prototype.GetAllCheckBox = function () {
	    var that = this;
	    var arr = new Array();
	    var arrIndex = 0;
	    var cks = that.getByClassName('layui-xtree-checkbox');
	    for (var i = 0; i < cks.length; i++) {
	        arr[arrIndex] = cks[i]; arrIndex++;
	    }
	    return arr;
	}

	//根据值来获取其父级的checkbox原dom对象
	layuiXtree.prototype.GetParent = function (a) {
	    var that = this;
	    var cks = that.getByClassName('layui-xtree-checkbox');
	    for (var i = 0; i < cks.length; i++) {
	        if (cks[i].value == a) {
	            if (cks[i].parentNode.parentNode.getAttribute('id') == that._container.getAttribute('id')) return null;
	            return that.getChildByClassName(cks[i].parentNode.parentNode, 'layui-xtree-checkbox')[0];
	        }
	    }
	    return null;
	}
	
	var xtree = function(){
		return layuiXtree;
	}
	
	exports("xtree",xtree());
})
