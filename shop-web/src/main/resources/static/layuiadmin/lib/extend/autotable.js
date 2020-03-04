layui.define(["table", "form", "laydate","autoform"], function (exports) {
    let $ = layui.$, table = layui.table;
    let layer = layui.layer;
    let form = layui.form;
    let laydate = layui.laydate;
    let autoform = layui.autoform;

    class autotable {
        constructor(obj) {
            if (!obj.mkbm)
                throw "mkbm(模块编码不能为空)"
            this.config = $.extend({
                container: "listdiv",
                rawTableConfig: {},
            }, obj);

            let colsTemplet = {
                yn: function (rowData, field) {
                    let val = rowData[field];
                    if (val != null && val == "Y") {
                        return "是";
                    } else {
                        return "否";
                    }
                }
            };
        }

        setWhereData(obj) {
            this.whereData = obj;
        }

        loadEntityInfo() {
            let mkbm = this.config.mkbm;
            let that = this;
            let data = null;
            $.ajax({
                url: "/system/auto/queryModuleConfig",
                async: false,
                type: "post",
                data: {"_mkbm": mkbm},
                dataType: "json",
                success: function (res) {
                    if (res.success) {
                        data = res.data;
                    }
                },
                error() {
                    layer.alert("模块配置读取失败");
                }
            });
            if (!data)
                throw "模块配置读取失败";
            that.entityInfo = data.entityInfo;
            that.methods = data.methods;
            return data;
        }

        buildTableCols() {
            let that = this;
            let config = this.config;
            let cols = [{checkbox: true}];
            let items = this.entityInfo.items;
            that.methodSort();
            for (const item of items) {
                if ((!item.islist || item.islist == "N") || (!item.listhide && item.listhide == "Y"))
                    continue;
                let col = {
                    field: item.stxbh,
                    title: item.listtitle,
                    align: 'center'
                };

                if (item.listtype) {
                    col.type = item.listtype;
                }
                col.width = item.listwidth;
                if (item.listfixed)
                    col.fixed = item.listfixed;

                if (item.stxbh == "_czl") {
                    let len = that.methods.filter(function (item) {
                        return item.czlbbm == "ope"
                    })
                    col.width = len.length * 60
                    col.templet = function (rowData) {
                        let methods = that.methods;
                        let btnHtml = "";
                        for (let i = 0; i < methods.length; i++) {
                            const method = methods[i];
                            if (method.czlbbm == "ope") {
                                if (that.btnShow(rowData, method.czbm)) {
                                    btnHtml += that.getMethodButton(method, "layui-btn-xs").prop("outerHTML");
                                }
                            }
                        }
                        return btnHtml;
                    }
                } else if (item.listtemplet) {
                    let templetName = item.listtemplet;
                    col.templet = function (rowData) {
                        that.colsTemplet[templetName](rowData, col.field);
                    }
                }
                cols.push(col);
            }
            return [cols];

        }

        itemListSort() {
            let items = this.entityInfo.items;
            items.sort(function (a, b) {
                let apxh = a.listpxh || 0;
                let bpxh = b.listpxh || 0;
                return apxh - bpxh;
            });
        }

        itemSearchSort() {
            let items = this.entityInfo.items;
            items.sort(function (a, b) {
                let apxh = a.searchpxh || 0;
                let bpxh = b.searchpxh || 0;
                return apxh - bpxh;
            });
        }

        methodSort() {
            let methods = this.methods;
            methods.sort(function (a, b) {
                let apxh = a.pxh || 0;
                let bpxh = b.pxh || 0;
                return apxh - bpxh;
            });
        }

        buildToolbar() {
            let that = this;
            let config = that.config;
            let container = $(config.container);
            let toolbar = $(document.createElement("div"));
            toolbar.attr("id", "_toolbar")
            toolbar.appendTo(container);
            let methods = this.methods;
            for (let i = 0; i < methods.length; i++) {
                const method = methods[i];
                if (method.czlbbm == "bar") {
                    this.getMethodButton(method, "layui-btn-sm").appendTo(toolbar);
                }
            }
        }

        getMethodButton(method, sizeClass) {
            let btn = $(document.createElement("button"));
            btn.attr("type", "button");
            btn.addClass("layui-btn " + sizeClass);
            btn.data("type", method.czbm);
            btn.attr("lay-event", method.czbm);
            if (method.clazzbm) btn.addClass(method.clazzbm);
            let btnCon = "";
            if (method.iconbm) btnCon += " <i class=\"layui-icon\">&#" + method.iconbm + ";</i>";
            btnCon += method.czmc;
            btn.html(btnCon);
            return btn;
        }

        bindToolbar() {
            let that = this;
            // 监听列表上方按钮
            $('#_toolbar .layui-btn').on('click', function () {
                let checkStatus = table.checkStatus("autotable");
                let data = checkStatus.data;
                let type = $(this).attr('lay-event') + "Toolbar";
                that[type] ? that[type](data) : '';
            });
        }

        /**
         * 操作列事件绑定
         */
        bindOperation() {
            let that = this;
            table.on('tool(autotable)', function (obj) {
                let data = obj.data;
                let event = obj.event;
                that[event + "Operation"] && that[event + "Operation"](data);
            });
        }

        buildTable() {
            let that = this;
            let config = that.config;
            let container = $(config.container);
            let tableDom = $(document.createElement("table"));
            tableDom.attr("id", "autotable");
            tableDom.attr("lay-filter", "autotable");
            tableDom.appendTo(container);
            this.itemListSort();
            let cols = this.buildTableCols();


            if (config.rawTableConfig && config.rawTableConfig.where) {
                config.rawTableConfig.where[_mkbm] = that.config.mkbm;
            }

            let tabParam = $.extend({
                elem: tableDom
                , cellMinWidth: 80
                , height: 'full-220'
                , url: '/system/auto/queryByPage' //数据接口
                , page: true //开启分页
                , limits: [10, 20, 50, 100, 200, 500]
                , method: "post"
                , limit: 10
                , cols: cols
                , where: $.extend(that.whereData, {
                    _mkbm: that.config.mkbm
                })
                , parseData: function (res) {
                    return {
                        code: "0",
                        count: res.total,
                        data: res.records
                    }
                }
                , request: {
                    pageName: "current",
                    limitName: "size"
                }
            }, config.rawTableConfig);

            //第一个实例
            this.tabins = table.render(tabParam);
        }

        reload() {
            this.tabins.reload();
        }

        buildSearch() {
            let that = this;
            let container = $(this.config.container);
            let searchForm = $(document.createElement("div"));
            searchForm.addClass("layui-row layui-form");
            searchForm.attr("lay-filter", "search_form");
            searchForm.appendTo(container);
            this.itemSearchSort();
            let items = this.entityInfo.items;
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.issearch != "Y" || item.searchhide == "Y")
                    continue;
                let type = item.searchtype;
                switch (type) {
                    case "select":
                        this.setSearchSelect(item, searchForm);
                        break;
                    case "date":
                        this.setSearchInputOfDate(item, searchForm);
                        break;
                    case "betweendate":
                        this.setSearchInputOfBetweenDate(item, searchForm);
                        break;
                    default:
                        this.setSearchInputOfText(item, searchForm);
                }
            }
            let searchBtn = $(document.createElement("button"));
            searchBtn.addClass("layui-btn layui-btn-sm");
            searchBtn.attr("lay-submit", true);
            searchBtn.attr("lay-filter", "s-form");
            searchBtn.text("查询");
            searchBtn.css("margin", "5px");
            searchBtn.appendTo(searchForm);
            form.render();

            form.on('submit(s-form)', function (data) {
                console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
                console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
                console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
                let whereData = that.searchDataHandle(data.field);
                // layer.msg("恭喜你成功了");
                whereData._mkbm = that.config.mkbm;
                that.tabins.reload({
                    where: whereData
                });
                return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
            });
        }

        addToolbar(data) {
            let mkbm = this.config.mkbm;
            let rewriteUrl = this.config.rewriteUrl;
            if (!rewriteUrl) {
                rewriteUrl = '/static/product/template/editTable.html?editType=add&_mkbm=' + mkbm;
            }
            layer.open({
                btnAlign: 'c',
                type: 2,
                title: "添加",
                content: rewriteUrl,
                maxmin: !0,
                area: ['95%', '95%'],
                btn: ['确认', '取消'],
                yes: function (index, layero) {
                    let submit = layero.find('iframe').contents().find("button[lay-submit]");
                    submit.trigger('click');
                },
                btn2: function (index, layero) {
                    layer.close(index);
                },
                success: function (layero, index) {
                }
            });
        }

        batchDelToolbar(data) {
            let that = this;
            let mkbm = this.config.mkbm;
            let entityInfo = this.entityInfo;
            let zjzd = entityInfo.zjzd;
            if (data.length == 0) {
                layer.msg("请至少选择一条数据");
                return;
            }
            let ids = [];
            for (const d of data) {
                ids.push(d[zjzd]);
            }
            layer.confirm("删除之后将无法恢复，请确认", function () {
                $.ajax({
                    url: "/system/auto/delete",
                    data: {ids: ids, _mkbm: mkbm},
                    dataType: "json",
                    type: "post",
                    success: function (res) {
                        if (res.success) {
                            layer.msg("删除成功，共删除 " + res.data + " 条数据");
                            that.reload();
                        } else {
                            layer.msg("删除失败，请刷新后重试");
                        }
                    },
                    error: function () {
                        layer.alert("网络错误");
                    }
                });
            })
        }

        delOperation(data) {
            let that = this;
            let mkbm = this.config.mkbm;
            let entityInfo = this.entityInfo;
            let zjzd = entityInfo.zjzd;
            layer.confirm("删除之后将无法恢复，请确认", function () {
                $.ajax({
                    url: "/system/auto/delete",
                    data: {id: data[zjzd], _mkbm: mkbm},
                    dataType: "json",
                    type: "post",
                    success: function (res) {
                        if (res.success) {
                            layer.msg("删除成功");
                            that.reload();
                        } else {
                            layer.msg("删除失败，请刷新后重试");
                        }
                    },
                    error: function () {
                        layer.alert("网络错误");
                    }
                });
            });
        }

        updOperation(data) {
            let mkbm = this.config.mkbm;
            let zjzd = this.entityInfo.zjzd;
            let rewriteUrl = this.config.rewriteUrl;
            if (!rewriteUrl) {
                rewriteUrl = '/static/product/template/editTable.html?_mkbm=' + mkbm + '&id=' + data[zjzd];
            }
            layer.open({
                btnAlign: 'c',
                type: 2,
                title: "修改",
                content: rewriteUrl,
                maxmin: !0,
                area: ['95%', '95%'],
                btn: ['确认', '取消'],
                yes: function (index, layero) {
                    let submit = layero.find('iframe').contents().find("button[lay-submit]");
                    submit.trigger('click');
                },
                btn2: function (index, layero) {
                    layer.close(index);
                },
                success: function (layero, index) {
                }
            });
        }

        detailOperation(data) {
            let mkbm = this.config.mkbm;
            let zjzd = this.entityInfo.zjzd;
            let rewriteUrl = this.config.rewriteUrl;
            if (!rewriteUrl) {
                rewriteUrl = '/static/product/template/editTable.html?_mkbm=' + mkbm + '&editType=view&id=' + data[zjzd];
            }
            layer.open({
                btnAlign: 'c',
                type: 2,
                title: "查看",
                content: rewriteUrl,
                maxmin: !0,
                area: ['95%', '95%'],
                btn: ['确认'],
                yes: function (index, layero) {
                    layer.close(index);
                },
                success: function (layero, index) {
                }
            })
        }

        getFormItem() {
            let item = $(document.createElement("div"));
            item.addClass("layui-inline");
            item.css("margin", "5px 0");
            return item;
        }

        setSearchInputOfText(item, form) {
            let name = item.stxbh;
            let title = item.searchtitle.toLowerCase();
            let formItem = this.getFormItem();
            formItem.html("<label class=\"layui-form-label\">" + title + "</label><div class=\"layui-input-inline\" style=\"width: 200px;\"><input type=\"text\" name=\"" + name + "\" autocomplete=\"off\" class=\"layui-input\"></div>")
            formItem.appendTo(form);
        }

        setSearchInputOfBetweenDate(item, form) {
            let name = item.stxbh;
            let title = item.searchtitle.toLowerCase();
            let formItem = this.getFormItem();
            formItem.html("<label class=\"layui-form-label\">" + title + "</label>" +
                "<div class=\"layui-input-inline\" style=\"width: 200px;\">" +
                "<input type=\"text\" readonly name=\"" + name + "_ks\" autocomplete=\"off\" class=\"layui-input\"></div>" +
                "<span>&nbsp;&nbsp;-&nbsp;&nbsp;</span><div class=\"layui-input-inline\" style=\"width: 200px;\"><input type=\"text\" readonly name=\"" + name + "_js\" autocomplete=\"off\" class=\"layui-input\"></div>")
            let format = item.searchfromat;
            formItem.appendTo(form);
            this.dateInit(formItem.find("input"), format);
        }

        setSearchInputOfDate(item, form) {
            let name = item.stxbh;
            let title = item.searchtitle.toLowerCase();
            let formItem = this.getFormItem();
            formItem.html("<label class=\"layui-form-label\">" + title + "</label><div class=\"layui-input-inline\" style=\"width: 200px;\"><input type=\"text\" readonly name=\"" + name + "\" autocomplete=\"off\" class=\"layui-input\"></div>")
            let format = item.searchfromat;
            formItem.appendTo(form);
            this.dateInit(formItem.find("input"), format);
        }

        setSearchSelect(item, form) {
            let name = item.stxbh;
            let title = item.searchtitle.toLowerCase();
            let formItem = this.getFormItem();
            formItem.html("<label class=\"layui-form-label\">" + title + "</label><div class=\"layui-input-inline\" style=\"width: 200px;\"><select readonly lay-filter=\"" + name + "\" name=\"" + name + "\"></select></div>")
            formItem.appendTo(form);
            autoform.buildSelectOption(formItem.find("select"),item.searchformat);
        }

        searchDataHandle(data) {
            let items = this.entityInfo.items;
            for (const item of items) {
                if (item.issearch != "Y" || item.searchhide == "Y")
                    continue;
                let type = item.searchtype;
                if (type == "betweendate") {
                    date[item.stxbh] = "";
                    if (data[item.stxbh + "_ks"]) {
                        date[item.stxbh] += data[item.stxbh + "_ks"];
                        delete data[item.stxbh + "_ks"];
                    }
                    date[item.stxbh] += ";";
                    if (data[item.stxbh + "_js"]) {
                        date[item.stxbh] += data[item.stxbh + "_js"];
                        delete data[item.stxbh + "_js"];
                    }
                }
            }
            return data;
        }

        getSearchData() {
            form.val("formTest");
        }


        /**
         * 日期组件初始化
         * @param $inp
         * @param formatJson
         */
        dateInit($inp, formatJson) {
            let obj = formatJson ? $.parseJSON(formatJson) : {};
            let format = obj.format || "yyyyMMdd";
            let type = obj.type || "date";
            $inp.each(function () {
                laydate.render({
                    elem: this
                    , type: type
                    , format: format
                });
            });
        }

        //getIdsFromCheck


        /**
         * 操作列 按钮控制
         * @param rowDate
         * @param czbm
         * @returns {boolean} true：显示 false: 隐藏
         */
        btnShow(rowDate, czbm) {
            return true;
        }

        /**
         * 添加自定义的Templet
         * @param code 与数据库中listTemplet 匹配
         * @param fun 回调函数 function(field,rowData){...}
         */
        addColsTemplet(code, fun) {
            this.colsTemplet[code] = fun;
        }

        /**
         * 获取ID
         * @param data 若是数组则返回数组元素id集合 否则 直接返回id
         * @returns {[]|*}
         */
        getIdFromData(data) {
            if (!data) return false;
            let zjzd = this.entityInfo.zjzd;
            if (Array.isArray(data)) {
                let ids = [];
                for (const datum of data) {
                    ids.push(datum[zjzd]);
                }
                return ids;
            } else {
                return data[zjzd];
            }
        }

        /**
         * 获取当前选中数据的id集合
         * @returns {*[]|*}
         */
        getIdFromCheck() {
            let checkStatus = table.checkStatus("autotable");
            let data = checkStatus.data;
            return this.getIdFromData(data);
        }

        /**
         * 一个简单的行修改
         * @param id    要修改的行的主键
         * @param data  要修改的内容，按需修改
         * @param callback  修改后回调
         * @param error  异常处理回调
         */
        simpleUpdate(id, data, callback, error) {
            let that = this;
            $.ajax({
                url: "/system/auto/update",
                data: $.extend(data, {_id: id, _mkbm: that.config.mkbm}),
                type: "post",
                success: function (res) {
                    if (callback) {
                        callback(res);
                    } else if (res.success) {
                        layer.msg("修改成功");
                        that.reload();
                    } else {
                        layer.alert("修改失败，请确认修改内容");
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // 通常 textStatus 和 errorThrown 之中
                    // 只有一个会包含信息
                    this; // 调用本次AJAX请求时传递的options参数
                    if (error)
                        error(XMLHttpRequest, textStatus, errorThrown);
                    else {
                        layer.alert("系统错误，请稍后重试");
                    }
                }
            })
        }


        /**
         * 获取form表单值
         * @returns {*}
         */
        getSearchData() {
            let data = form.val("search_form");
            return this.searchDataHandle(data);
        }

        buildContainer() {
            toolbar.appendTo(container);
        }

        render() {
            let that = this;
            this.loadEntityInfo();
            this.buildSearch();
            this.buildToolbar();
            this.buildTable();
            this.bindToolbar();
            this.bindOperation();
            window.tableReload = function () {
                that.reload();
            }
        }
    }


    exports("autotable", autotable);
});