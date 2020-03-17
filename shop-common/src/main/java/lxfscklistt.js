function editTable() {
    let baseUtil = layui.baseUtil;
    let editTable = layui.editTable;
    let form = layui.form;
    let $ = layui.$;
    let mkbm = baseUtil.getQueryString("_mkbm");
    let id = baseUtil.getQueryString("id");
    let editType = baseUtil.getQueryString("editType");
    let sfgxl = baseUtil.getQueryString("sfgxl");

    let ut = new editTable({
        container: "#cn",
        mkbm: mkbm,
        editType:editType,
        id: id
    });

    //扩展方法
    editTable.prototype.extendMethod=function () {
        var that = this;

        //初始化事件
        initEvent(editType);
        //学生基本信息
        initData(that.config.id);
    };

    //重写submit提交事件
    editTable.prototype.submit=function () {
        let that = this;
        form.on('submit(submit)', function(data){
            debugger
            let a = that.config.id;
            debugger
            let url = "/xj/lxfsck/yjsjbxx/"+that.config.id;
            if(that.config.id){
                data.field._id = id;
            }
            data.field._mkbm = mkbm;
            debugger
            let btn = data.elem;
            $(btn).attr('disabled',true);
            baseUtil.ajax("POST", false, url, data.field, "json", function (result) {
                if(result.success){
                    parent.tableReload();
                    layer.msg('提交成功保存', {
                        icon: 1,
                        time: 1000 //2秒关闭（如果不配置，默认是3秒）
                    }, function(){
                        $(btn).attr('disabled',false);
                        let index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                        if (index) {
                            parent.layer.close(index);
                        }
                    });
                }else {
                    debugger
                    layer.msg(result.msg);
                }
            });
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
    };
    ut.render();

    /**
     * 其他方法
     */

    function initEvent(editType) {
        if(editType == "view")
            baseUtil.setDocumentDisabled(["globalDiv"], "none");

    }

    function initData(yjsjbxxid) {
        var that = this;
        baseUtil.ajax("POST", false, "/xj/yjsjbxxquery/queryYjsjbxxByYjsjbxxid", {"yjsjbxxid":yjsjbxxid}, "json", "", function (result) {
            let data = result.data;
            $("#xh").val(data.xh);
            $("#xm").val(data.xm);
            $("#dsxm").val(data.dsxm);
            $("#rxnj").val(data.rxnj);
            $("#zdnj").val(data.zdnj);
            $("#szyxsmc").val(data.szyxsmc);
            $("#bxzymc").val(data.bxzymc);
            $("#xslbmc").val(data.xslbmc);
            $("#lqlbmc").val(data.lqlbmc);

            $("#yddh").val(data.yddh);
            $("#dzxx").val(data.dzxx);
            $("#qqhm").val(data.qqhm);
            $("#wxzh").val(data.wxzh);

        });
    }

}


