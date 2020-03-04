var form;
var wlHost = window.location.hostname;//示例 127.0.0.1
var wlPort = window.location.port;//示例 80
var ip = "127.0.0.1:80";

function login() {
    form = layui.form;
    debugger
    //监听回车--登录
    $(document).keyup(function(event){
        if(event.keyCode ==13){
            $("#login").click();
        }
    });

    //提交表单
    submit();
};

function submit(){
    //监听表单按钮
    form.on('submit(loginSubmit)',function (formData) {
        var field = formData.field;
        var a = ip+ "/system/user/id";
        debugger
        $.ajax({
            type: "GET",
            async: false,
            url: "/system/user/id", //(必需)
            data: field, // 参数
            dataType: "json",
            success: function(result) {
                location.href = "/static/templates/goods_list.html";
            },
            error: function() {
                location.href = "/static/templates/error/404.html";
            }
        });
    });
}