var t = new Date().getTime();
document.write('<link href="/static/product/common/allcss/reset.css?v='+t+'" media="all">');
document.write('<link rel="stylesheet" href="/static/layuiadmin/layui/css/layui.css?v='+t+'" media="all">');
document.write('<link href="/static/product/common/allcss/rewrite.css.css?v='+t+'" media="all">');
document.write('<link rel="stylesheet" href="/static/layuiadmin/style/formSelects-v4.css?v='+t+'" media="all">');
document.write('<script src="/static/product/common/alljs/web.js?v='+t+'"><\/script>');
document.write('<script src="/static/layuiadmin/layui/layui.js?v='+t+'"><\/script>');
document.write(`<style>
    body,html{
        background: #fff;
    }
    .layui-container{
        width: 100% !important;
        padding: 15px;
        background: #fff;
    }
    .layui-container:after{
        content: '';
        display: block;
        clear: both;
    }
    div[class*=layui-col-xs]{
        position: relative;
    
    }
    .layui-form-item .layui-input-inline{
        width: 60%;
        min-width: 190px;
    }
    .layui-input{
        height: 30px;
        line-height: 30px;
    }
    .layui-form-item .layui-input-inline[lang|='checkbox']{
        width:auto;
    }
    .layui-elem-field legend{
        font-weight: bold;
        color: #009F95;
    }
    .layui-elem-quote {
        color: #088a7e;
        background: rgba(143, 213, 255, 0.63);
    }
    .layui-form-label{
        position: relative;
        padding: 0px;
        right: 10px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 30px;
        line-height: 1;
    }
    .layui-field-box{
        padding: 30px 15px;
    }
    .layui-elem-field{
        border-color: #009F95;
    }
    .block{
        text-align: center;
        display: flex;
        margin-top: 30px;
        margin-bottom: 20px;
    }
    .block .layui-bg-green{
        width: 100%;
        position: absolute;
        margin: 0;
        top: 50%;
    }
    .block b{
        padding: 0 10px;
        font-size: 18px;
        color: #009688;
    }
    .block p{
        background: #fff;
        position: relative;
        z-index: 99;
        left: 10%;
    }
    .block span{
        display: block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 1px solid #009688;
        display: inline-block;
    }
    .tips{
        color: #FF5722;
        line-height: 1;
        margin: 5px 0px;
    }
    .h-img{
        width: 75px;
        height: 105px;
        display: block;
        margin-bottom: 5px;
    }
    .layui-elem-quote {
        color: #088a7e;
        background: rgba(143, 213, 255, 0.63);
    }
    .time{
        line-height: 25px;
        height: 25px;
    }
    .btn-box{
        width: 40%;
        margin: 0 auto;
        display: flex;
        justify-content: space-around;
    }
    .red{
        color: #FF5722;
    }
    .reded{
        display: none;
    }
    #zp{
        height: 0px;
        border: none;
    }
    #zjrdtjBox{
        display:none;
    }
    .layui-icon-close{
        font-size:12px;
        color:#FF5722;
    }
</style>`);