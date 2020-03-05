var form = layui.form;

function goodlist() {
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

}


function dump() {
    form.on('submit(dump)',function () {
        debugger

    });
}