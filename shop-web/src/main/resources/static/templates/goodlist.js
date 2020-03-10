var form;
var layer;
function goodlist() {
    form = layui.form;
    layer = layui.layer;
    //查询所有商品
    getGoodList();
    dump();

}

//查询商品
function getGoodList() {
    debugger
    $.ajax({
        type: "GET",
        async: false,
        url: "/seckill/good/goods",
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
function renderDiv(result) {
    var goodList = result.data;
    var good = goodList[0];
    debugger
    $("#goodname").text(good.goodsName);
    $("#img").attr("src", good.goodsImg);
    $("#goodtitle").text(good.goodsTitle);
    $("#seckillprice").text(good.seckillPrice);
    $("#goodprice").text(good.goodsPrice);
    $("#stock_count").text(good.stockCount);
    $("#goodId").val(good.id);


}


function dump() {
    form.on('submit(dump)',function (data) {
        debugger
        var goodId = $("#goodId").val();
        debugger
        dfs(goodId);
    });
}

//轮询请求
function dfs(goodId) {
    $.ajax({
        type: "PUT",
        async: false,
        url: "/seckill/seckill/good/"+goodId,
        data: {"goodId":goodId}, // 参数
        dataType: "json",
        success: function(result) {
            var data = result.data;
            if(data == 0){//说明仍然在排队
                setTimeout(function () {
                    dfs(goodId);
                }, 200);
            }
            else if(data < 0){//说明商品已经没有库存了
                layer.confirm("很遗憾,您没有秒杀到商品",function () {
                   layer.close();
                });
            }
            else{
                layer.confirm("恭喜您已经秒杀到商品",function () {
                    layer.close();
                });
            }
        },
        error: function() {
            debugger
        }
    });
}