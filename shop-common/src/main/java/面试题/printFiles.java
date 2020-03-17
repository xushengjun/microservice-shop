package 面试题;

import java.io.File;
import java.io.FileWriter;
import java.util.*;

/**
 * 遍历打印文件夹
 * @ClassName printFiles
 * @Author zhaoqin
 * @Date 2020/3/16
 */
public class printFiles {
    private static List<String> fileList = new ArrayList<>();
    private static List<String> dirList = new ArrayList<>();


    public void main(String[] args) {
       // 题目1 要求每个文件夹按照文件大小倒序排列  要求打印信息： 文件名称 文件大小
       // 题目2 要求打印出每个文件夹下面 文件夹的个数  文件的个数  还有每个文件夹的大小

       //前瞻 文件大小怎么转化为mb


    }

    /**
     * 第二题 第二问
     * 遍历打印所有文件
     */
    public static void listFiles(String path){
        //目标文件夹
        File targetDir = new File(path);
        if(!targetDir.exists())
            System.out.println("该文件夹不存在!");

        //递归
        for(File file : targetDir.listFiles()){
            if(file.isDirectory()){
                dirList.add(file.getName());
                System.out.println("文件夹：" + file.getName() + " " + file.length());
                listFiles(file.getAbsolutePath());
            }
            else{
                fileList.add(file.getName());
                System.out.println("文件:" + file.getName() + " " + file.length());
            }

        }
    }



}
