layui.define(["form","laydate","baseUtil"], function (exports) {
    let $ = layui.$, baseUtil = layui.baseUtil;
    let layer = layui.layer;
    let form = layui.form;
    let laydate = layui.laydate;
    class editTable {
        constructor(obj) {
            if (!obj.mkbm){
                layer.msg("mkbm(模块编码不能为空)");
                return false;
            }
            this.config = $.extend({}, obj);
        }
        // 拿取列表数据
        createHtml(){
            let mkbm = this.config.mkbm;
            let id = this.config.id;
            let that = this;
            let data = null;
            $.ajax({
                url: "/system/auto/queryUserEntityInfo",
                async: false,
                type: "post",
                data: {"_mkbm": mkbm, "id": id},
                dataType: "json",
                success: function(result) {
                    if(result.success){
                        data = result.data;
                    }
                    that.buildHtml(data.items);

                },
                error: function(request) {
                    let responseJSON = request.responseJSON
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
        // 获取当前模板数据
        getFormVal(){
            let mkbm = this.config.mkbm;
            let id = this.config.id;
            let that = this;
            $.ajax({
                url: '/system/auto/queryById',
                async: false,
                type: "post",
                data: {'_mkbm': mkbm, 'id': id },
                dataType: "json",
                success: function(result) {
                    if(result.success){
                        let data = result.data
                        if(that.config.editType&&that.config.editType=='view'){
                            for(let item in data){
                                $("#"+item).text(data[item])
                            }
                        }else {
                            form.val("layui-form",data);
                        }

                        form.render()
                    }else {
                        layer.msg(result.data)
                    }

                },
                error: function(request) {
                    let responseJSON = request.responseJSON
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
        // 生成html
        buildHtml(data){
            let container = this.config.container;
            let html = '';
            let formContainer = $(document.createElement("form"));
            formContainer.attr("id", "layui-form");
            formContainer.attr("class", "layui-col-xs12 layui-form layui-container")
            formContainer.attr("lay-filter", "layui-form")
            data = data.sort(baseUtil.compare('editrownum',true))
            if(this.config.editType&&this.config.editType=='view'){
                data.forEach(item=>{
                    html +=`${
                        (function () {
                            if(item.stxbh=='_czl'&&item.isedit=='N'){
                                return ''
                            }else if(item.edittype=='hidden') {
                                return `<input class="layui-input" type="hidden"  name="${item.stxbh}" id="${item.stxbh}" value="" lay-filter="${item.editverify}" lay-verify="${item.editverify}">`
                            }else if (item.edittype=='fgf'){
                                return `<div class="layui-col-xs12 block">
                                        <blockquote class="layui-elem-quote">${item.edittitle}</blockquote>
                                    </div>`
                            }else {
                                return `<div class="layui-col-xs${item.editwidth?item.editwidth:'12'}">
                                        <div class="layui-form-item">
                                           <span class="${item.editverify==null?'reded':'red'}">*</span>${item.edittitle}：<b id="${item.stxbh}"></b>
       
                                        </div>
                                    </div>`
                            }
                        })()
                    }`
                })
            }else {
                data.forEach(item=>{
                    html +=`${
                        (function () {
                            if(item.isedit=='N'){
                                return ''
                            }else if(item.edittype=='hidden') {
                                return `<input class="layui-input" type="hidden"  name="${item.stxbh}" id="${item.stxbh}" value="" lay-filter="${item.editverify}" lay-verify="${item.editverify}">`
                            }else if (item.edittype=='fgf'){
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
            }

            formContainer.append(html)
            formContainer.append(`<button style="display: none" class="layui-btn layui-btn" lay-submit lay-filter="submit"  id="submit">提交</button>`)
            $(container).append(formContainer)
            if(this.config.editType!='add'){
                this.getFormVal()
            }
            form.render()
        }
        // 自定义方法需要自己重写方法
        extendMethod(){

        }
        // 提交
        submit(){
            let that = this
            form.on('submit(submit)', function(data){
                let mkbm = that.config.mkbm;
                let id = that.config.id;
                let url = that.config.id?"/system/auto/update":"/system/auto/save"
                if(that.config.id){
                    data.field._id = id;
                }
                data.field._mkbm = mkbm;
                debugger
                let btn = data.elem
                $(btn).attr('disabled',true)
                $.ajax({
                    url: url,
                    async: false,
                    type: "post",
                    data: data.field,
                    dataType: "json",
                    success: function(result) {
                        if(result.success){
                            parent.tableReload()
                            layer.msg('提交成功保存', {
                                icon: 1,
                                time: 1000 //2秒关闭（如果不配置，默认是3秒）
                            }, function(){
                                $(btn).attr('disabled',false)
                                let index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                                if (index) {
                                    parent.layer.close(index);
                                }
                            });
                        }else {
                            layer.msg(result.data)
                        }

                    },
                    error: function(request) {
                        let responseJSON = request.responseJSON
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
                return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
            });
        }
        render() {
            this.createHtml();
            this.submit();
            this.extendMethod();
        }
    }


    exports("editTable", editTable);
});