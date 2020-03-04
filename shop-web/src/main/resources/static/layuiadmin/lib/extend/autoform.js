layui.define(['form'], function (exports) {

    let $ = layui.$;
    let form = layui.form;
    let layer = layui.layer;

    class autoform {
        buildSelectOption(select, formatJsonStr) {
            if (!formatJsonStr || formatJsonStr.trim() == "") {
                return false;
            }
            let format = $.parseJSON(formatJsonStr);
            if (!format) return false;
            let isReady = false;
            let textField = "mxz";
            let valueField = "mxbh";
            /**
             * 三种数据初始化方式
             */
            //通过编码编号初始化
            if (format.bmbh) {
                isReady = this.prepareSelectData(select, "/system/bmbh/queryByBmbh", {bmbh: format.bmbh});
                //通过url初始化
            } else if (format.url && format.text && format.value) {
                textField = format.text;
                valueField = format.value;
                isReady = this.prepareSelectData(select, format.url, {});
                //通过固定数组初始化
            } else if (format.data && format.data.length > 0) {
                textField = "text";
                valueField = "value";
                select.data("data", format.data);
                isReady = true;
                console.log("select option 初始化失败，原因是format信息不完整");
            }else{
                return false;
            }
            if (!isReady) return false;

            if (format.rely) {
                let filter = format.rely;
                form.on('select(' + filter + ')', function (data) {
                    console.log(data.elem); //得到select原始DOM对象
                    console.log(data.value); //得到被选中的值
                    console.log(data.othis); //得到美化后的DOM对象
                    let datum = $(data.elem).find(":selected").data("data");
                    let bmbh = "";
                    let mxbh = "";
                    if (datum) {
                        bmbh = datum.bmbh;
                        mxbh = datum.mxbh;
                    }
                    this.reloadSelect(select, textField, valueField, bmbh, mxbh);
                });
            } else {
                this.reloadSelect(select, textField, valueField);
            }

            let fillTo = format.fillto;

            let textTo = format.textTo;

            if(fillTo || textTo){
                fillTo = fillTo || {};
                if(textTo){
                    fillTo[textField] = textTo;
                }
                this.bindSelectChange(select,fillTo);
            }
        }

        bindSelectChange($select,fileTo){
            let filter =  $select.attr("name");
            form.on('select('+filter+')', function(data){
                let datum = $(this.elem).find("option:selected").data("data");
                for (const item of fileTo) {
                    let field = item.field;
                    let to = item.to;
                    if(field&&to){
                        $("[name='"+to+"']").value(datum[field]);
                    }
                }

            });
        }

        prepareSelectData($select, url, data) {
            let resData = null;
            $.ajax({
                url: url,
                async: false,
                type: "post",
                data: data,
                dataType: "JSON",
                success: function (res) {
                    resData = res;
                },
                error: function () {
                    layer.alert("数据获取失败,url:" + url);
                    return false;
                }

            })
            if (!resData || !resData.success) return false;
            $select.data("data", resData.data);
            return true;
        }

        reloadSelect($select, textField, valueField, ssbmbh, ssmxbh) {
            let data = $select.data("data");
            for (const datum of data) {
                if (ssbmbh && ssmxbh) {
                    if (datum.ssbmbh != ssbmbh || datum.ssmxbh != ssmxbh) {
                        continue;
                    }
                }
                let opt = $(document.createElement("option"));
                opt.data("data", datum);
                opt.text(datum[textField]);
                opt.attr("value", datum[valueField]);
                opt.appendTo($select);
            }
            form.render("select");
        }
    }
    exports("autoform",new autoform());
})