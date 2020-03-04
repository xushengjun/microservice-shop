function index(){
    let baseUtil = layui.baseUtil;
    let $ = layui.$;
    let laydate = layui.laydate;
    //  模板预览地址  http://127.0.0.1/web/view/template/rewrite.html
    //  使用说明
    // <div class="layui-col-xs4">
    //     <div class="layui-form-item">
    //         ...
    //     </div>
    // </div>
    // 上边的为基础架构，按需复制  class="layui-col-xs4" 里的数字按需更改



    //js此位置开始复制，用哪个复制哪个
    // $('head').after('<style class="style"></style>')
    // $('.style').load('/web/view/sys/css/rewrite.css',function(){
    //     $('body').show()
    // })


    //时间插件
    //<input  class="layui-input" type="text" name="" time value="">  input 添加 time属性
    var timeInp = $('[time]');
    for (var i = 0; i < timeInp.length; i++) {
        laydate.render({
            elem: $(timeInp.eq(i))[0],
            type: 'month',
            format: 'yyyyMM',
            trigger:'click',
            done: function(value) {
                //
            }
        });
    }
    // 富文本编辑器
    //  使用富文本先 use 'layedit'  模块
    var layedit = layui.layedit;
    var index = layedit.build('fwb');
    var html = layedit.getContent(index); //获取编辑器内容
    var text = layedit.getText(index); //获取编辑器纯文本内容

    // 上传下载的整合,根据inputVal是否为空进行判断，inputVal为空则为上传
    // baseUtil.fileSuccess(eleid,filetype,p_text='',exts="*",inputName,inputVal='')
    // exts:上传类型  多类型的以‘|’为分隔符
    // eleid:页面点击上传按钮的idx_pslwdzbzdz
    // filetype：上传文件类型：例如：yjs_xw_sqxwyjsxx_pslwdzbzdz
    // p_text:提示文字内容
    // inputName:为保存入数据库的input的name
    baseUtil.fileSuccess('uploadBtn','yjs_xw_sqxwyjsxx_pslwdzbzdz','文字提示','','inputName','')


}