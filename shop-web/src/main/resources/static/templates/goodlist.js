var form = layui.form;

function goodlist() {
    //查询所有商品
    getGoodList();

}

//查询商品
function goodlist() {
    debugger
    $.ajax({
        type: "GET",
        async: false,
        url: "/seckill/good/goods", //(必需)
        data: {}, // 参数
        dataType: "json",
        success: function(result) {
            renderDiv(result);
        },
        error: function() {
            debugger
        }
    });
}

// 渲染页面
function rederDiv(){

}