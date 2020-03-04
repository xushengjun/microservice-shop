function editTable() {
    let baseUtil = layui.baseUtil;
    let editTable = layui.editTable;
    let $ = layui.$;
    let mkbm = baseUtil.getQueryString("_mkbm");
    let id = baseUtil.getQueryString("id");
    let editType = baseUtil.getQueryString("editType")
    let ut = new editTable({
        container: "#cn",
        mkbm: mkbm,
        editType:editType,
        id: id
    });
    ut.extendMethod = function(){

    }
    ut.render();
}