package com.zhaoqin.shopcommon.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;

/**
 * @ClassName CopySqlUtils
 * @Author zhaoqin
 * @Date 2020/3/6
 */
public class CopySqlUtils {


    public static void main(String[] args) {

        String[] codeList = new String[]{"xsdaglyy"};

//        String[] codeList = new String[]{
//        "xhbhgz","xslbdm","xsztdm","xjydlbdm","zcxxnxgz","bjdm","sfxmdm","kcxzdm","cjdjdm",
//                "pyhjlbdm","djkslbdm","byzgsctjdm","byzsbhgz","sqxwtjm","sqxwlcdm","dzcldm","xwzsbhgz","xwsqpc"};
        FileWriter writer = null;

        for (String code : codeList){
            String sql = print(code);
            //将sql写入文件中
            File file = new File("C://Users//haili//Desktop//3.sql");
            try {
                writer = new FileWriter(file, false);
                writer.append(sql);
                writer.flush();
            } catch (IOException e) {
                e.printStackTrace();
            }

//            System.out.println(sql);



        }

    }

    public static String print(String mkbm){
        String  sql = "insert into app_module_method (MKBM, CZBM, CZMC, CZLBBM, CZLBMC, ICONBM, ICONMC, CLAZZBM, CLAZZMC, PXH, BZ)"
                +"values('"+mkbm+"', 'add', '添加', 'bar', '工具条', null, null, null, null, 1, null);" +"\n"

                +"insert into app_module_method(MKBM, CZBM, CZMC, CZLBBM, CZLBMC, ICONBM, ICONMC, CLAZZBM, CLAZZMC, PXH, BZ)"
                +"values('"+mkbm+"', 'batchDel', '批量删除', 'bar', '工具条', null, null, null, null, 1, null);"  +"\n"

//                +"insert into app_module_method(MKBM, CZBM, CZMC, CZLBBM, CZLBMC, ICONBM, ICONMC, CLAZZBM, CLAZZMC, PXH, BZ)"
//                +"values('"+mkbm+"', 'exportStuMenu', '导出学生名单', 'bar', '工具条', null, null, null, null, 1, null);"  +"\n"

                +"insert into app_module_method(MKBM, CZBM, CZMC, CZLBBM, CZLBMC, ICONBM, ICONMC, CLAZZBM, CLAZZMC, PXH, BZ)"
                +"values('"+mkbm+"', 'del', '删除', 'ope', '操作列', null, null, null, null, 1, null);"  +"\n"

                +"insert into app_module_method(MKBM, CZBM, CZMC, CZLBBM, CZLBMC, ICONBM, ICONMC, CLAZZBM, CLAZZMC, PXH, BZ)"
                +"values('"+mkbm+"', 'detail', '查看', 'ope', '操作列', null, null, null, null, 1, null);"  +"\n"

                +"insert into app_module_method(MKBM, CZBM, CZMC, CZLBBM, CZLBMC, ICONBM, ICONMC, CLAZZBM, CLAZZMC, PXH, BZ)"
                +"values('"+mkbm+"', 'upd', '修改', 'ope', '操作列', null, null, null, null, 1, null);"  +"\n"

                //录入

                +"insert into app_module_method(MKBM, CZBM, CZMC, CZLBBM, CZLBMC, ICONBM, ICONMC, CLAZZBM, CLAZZMC, PXH, BZ)"
                +"values('"+mkbm+"', 'input', '录入档案信息', 'bar', '工具条', null, null, null, null, 1, null);"  +"\n"

                +"insert into app_module_method_right(JSID, MKBM, CZBM)"
                +"values('yy', '"+mkbm+"', 'input');"  +"\n"
                //导入
                +"insert into app_module_method(MKBM, CZBM, CZMC, CZLBBM, CZLBMC, ICONBM, ICONMC, CLAZZBM, CLAZZMC, PXH, BZ)"
                +"values('"+mkbm+"', 'import', '导入档案信息', 'bar', '工具条', null, null, null, null, 1, null);"  +"\n"

                +"insert into app_module_method_right(JSID, MKBM, CZBM)"
                +"values('yy', '"+mkbm+"', 'import');"  +"\n"

                //统计
//                +"insert into app_module_method(MKBM, CZBM, CZMC, CZLBBM, CZLBMC, ICONBM, ICONMC, CLAZZBM, CLAZZMC, PXH, BZ)"
//                +"values('"+mkbm+"', 'statistics', '统计', 'bar', '工具条', null, null, null, null, 1, null);"  +"\n"
//
//                +"insert into app_module_method_right(JSID, MKBM, CZBM)"
//                +"values('yy', '"+mkbm+"', 'statistics');"  +"\n"


//                +"insert into app_module_method_right(JSID, MKBM, CZBM)"
//                +"values('yy', '"+mkbm+"', 'exportStuMenu');"  +"\n"



                +"insert into app_module_method_right(JSID, MKBM, CZBM)"
                +"values('yy', '"+mkbm+"', 'add');"  +"\n"

                +"insert into app_module_method_right(JSID, MKBM, CZBM)"
                +"values('yy', '"+mkbm+"', 'batchDel');"  +"\n"

                +"insert into app_module_method_right(JSID, MKBM, CZBM)"
                +"values('yy', '"+mkbm+"', 'del');"  +"\n"

                +"insert into app_module_method_right(JSID, MKBM, CZBM)"
                +"values('yy', '"+mkbm+"', 'detail');"  +"\n"

                +"insert into app_module_method_right(JSID, MKBM, CZBM)"
                +"values('yy', '"+mkbm+"', 'upd');"   +"\n"  ;
        return sql;
    }
}
