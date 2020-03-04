layui.define([ 'jquery','baseUtil','upload'], function(exports) {
    var $ = layui.$;
    var baseUtil  = layui.baseUtil;
    var upload = layui.upload;
    class sytool{

        /**
         * 判断传入值是否为Y
         * @param str
         * @returns {boolean}
         */
        isYes(str){
            if(str&&str==="Y"){
                return true;
            }else{
                return false;
            }
        }

        /**
         * 将form表单元素转为data对象
         * @param container form元素的父元素
         */
        formToData(container){
            let $container = $(container);
            var input = $container.find(":input:not(button)");
            var paras = {};
            input.each(function(){
                let inp = $(this);
                let name =  inp.attr("name");
                if(name){
                    paras[name]=inp.val();
                }
            });
            return paras;
        }

        /**
         * 将 fileEntity 在指定位置显示下载链接，与上传配合使用
         * @param obj
         * @param btnSelector 上传按钮
         * @param inputName 期望将 refid存入的 input 的 name，为null则不存，不存在则创建
         * @param isShowBtn 是否显示下载按钮
         * @param ref
         * @param type
         */
        showUploadFileDownload(obj,btnSelector,inputName,isShowBtn,ref,type){
            let btn = $(btnSelector);
            if(!isShowBtn){
                btn.hide();
            }else{
                btn.show();
            }

            var $a = btn.siblings("a.downpdf");
            if($a.length==0){
                $a = $(document.createElement("a"));
                $a.attr("title","点击下载查看");
                $a.addClass("downpdf");
                btn.after($a);
            }
            if(inputName){
                var $inp = btn.siblings("input[name='"+inputName+"']");
                if($inp.length==0){
                    $inp = $(document.createElement("input"));
                    $inp.attr("type","hidden");
                    $inp.attr("name",inputName);
                    $inp.attr("id",inputName);
                    btn.after($inp);
                }
                $inp.val(ref);
            }

            $a.text(obj.orgfilename);
            $a.attr('href',wlFileDownByFileidUrl(obj.fileid));
        }

        /**
         * 根据ref 和 tyoe 在指定位置显示下载链接
         * 展示文件下载链接
         * @param btnSelector 上传按钮可以是  jquery选择器 或 直接传入jquery对象
         * @param inputName
         * @param isShowBtn
         * @param ref
         * @param type
         */
        showFileDownload(btnSelector,inputName,isShowBtn,ref,type){

            if(ref==null || ref==""){
                if(!isShowBtn) $(btnSelector).hide();
            }

            var $this = this;
            var _ajaxUrlStr = wlFileByFiletypeAndRefidUrl(type, ref);
            baseUtil.ajax("GET", true, _ajaxUrlStr, null, "json", null,function(result) {
                if (!baseUtil.isNullOrEmpty(result)) {
                    if (result.success && !baseUtil.isNullOrEmpty(result.obj)) {
                        $this.showUploadFileDownload(result.obj[0],btnSelector,inputName,isShowBtn,ref,type);
                    }
                }
            });
        }


        /**
         *绑定上传事件
         * @param selector 按钮选择器
         * @param reftype  app_file 中的type
         * @param uuid  refid
         * @param exts  允许上传的文件类型
         * @param isExist   文件是否已上传吗，已上传的话 会显示下载链接
         * @param inputName     上传完毕将uuid存在form表单元素的name，元素不存在则创建
         * @param callback  上传完成回调 fun
         * @param allowReUpload 是否允许重复上传
         */
        uploadFileBind(paras){
            var $this = this;
            var defaultParas = {
                selector:"",
                reftype:"",
                uuid:baseUtil.uuid(),
                exts:"*",
                isExist:false,
                allowReUpload:true,
                inputName:"",
                callback:"",
                delete : true
            }
            paras = $.extend(defaultParas,paras);
            var url = wlFileUploadUrl(paras.reftype,paras.uuid,paras.delete?"delete":null);

            var btn = $(paras.selector);
            var ysctext = paras.allowReUpload?"重新上传":"已上传";
            if(paras.isExist){
                btn.html(ysctext);
                $this.showFileDownload(btn,paras.inputName,true,paras.uuid,paras.reftype);
                if(!paras.allowReUpload) return;
            }

            upload.render({
                elem: btn,//绑定元素
                exts:paras.exts,
                url: url, //上传接口
                accept: 'file',
                done: function(res){
                    btn.html(ysctext);
                    $this.showUploadFileDownload(res.obj,btn,paras.inputName,true,paras.uuid,paras.reftype);
                    if(typeof (paras.callback) == 'function'){
                        paras.callback(res);
                    }
                },
                error: function(){
                    //请求异常回调
                    layer.msg("上传失败，请重新上传");
                }
            });
        }

        /**
         * 去除data中非 字符类型的项，去除 object [] fun等属性
         * @param data obj类型数据
         * @param removeType 需要删除项的type

         */
        removeType(data,removeType){
            var targetType = removeType || ['array','object','function'];
            if(typeof (targetType)=='string'){
                targetType = [targetType];
            }
            var check = function(d){
                for (const da of targetType) {
                    if(typeof (d)==da){
                        return true;
                    }
                }
            }
            for (const datum in data) {
                if(check(data[datum])){
                    delete data[datum];
                }
            }
        }

        /**
         * 全面禁止表单输入框 输入，调用后无法恢复原装
         * @param container
         */
        allTheReadOnly(container){
            container = container || document;
            $(":input:not(button)").each(function(){
                var inp = $(this);
                if(inp.attr("type").toLowerCase()=="file"){
                    inp.remove();
                }
            })
        }


        //上传
        uploadFile(url,callback){
            var btn = $(document.createElement("button"));
            btn.appendTo($("body"));
            //创建一个上传组件
            upload.render({
                elem: btn,
                url: url,
                done: function(res, index, upload){ //上传后的回调
                    callback&&callback(res);
                },
                accept: 'file' //允许上传的文件类型
            });
            btn.click();
        }

        /**
         * 下载文件
         * @param urlService service部分
         * @param data
         */
        downloadFile(urlService,data){
            this.removeType(data);
            var url = wlWeb+wlModuleSys +"/downloadfile?_service="+urlService;

            var ifr = $(document.createElement("iframe"));
            //ifr.hide();
            ifr.appendTo($("body"));
            var ifrCon = ifr.contents();
            var ifrBody = ifrCon.find("body");
            ifrBody.append("<form id='mainForm'></form>");
            var ifrForm = ifrBody.find("#mainForm");
            ifrForm.attr('action',url);
            ifrForm.attr('method',"post");
            var input = $(document.createElement("input"));
            for(var key in data){
                if(data[key]==null || data[key].trim()=="") continue;
                var $inp = input.clone();
                $inp.attr("name",key);
                $inp.val(data[key]);
                $inp.appendTo(ifrForm);
            }
            ifrForm.submit();
            ifr.hide();
        }

        /**
         * 根据ref与type下载文件
         * @param refid
         * @param type
         */
        downloadFileByRefIdAndType(refid,type){
            let url = wlFileDownByFiletypeAndRefidUrl(type,refid);
            var ifrm = $(document.createElement("iframe"));
            ifrm.hide();
            ifrm.appendTo($("body"));
            ifrm.attr("src",url);
            ifrm.hide();
        }

        downloadFileByFileid(fileid){
            let url = wlFileDownByFileidUrl(fileid);
            let ifrm = $(document.createElement("iframe"));
            ifrm.hide();
            ifrm.appendTo($("body"));
            ifrm.attr("src",url);
            ifrm.hide();
        }

    }
    exports("sytool",new sytool())
})
