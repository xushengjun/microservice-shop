function bkzydmlist() {
    let baseUtil = layui.baseUtil;
    let mkbm = baseUtil.getQueryString("_mkbm");
    let autotable = layui.autotable;
    let at = new autotable( {container: "#listDiv", mkbm: mkbm });
    at.render();

}

