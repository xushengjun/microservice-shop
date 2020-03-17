package 面试题;

/**
 * @ClassName First
 * @Author zhaoqin
 * @Date 2020/3/16
 */
public class A {

    public static void main(String[] args) {
        B b = new B();

        long start = System.currentTimeMillis(); //开始时间
        b.c(1234);
        long end = System.currentTimeMillis();//结束时间

        long userTime = end -start;//执行时间
        if(userTime/1000/60 > -1)
            throw new RuntimeException();

    }

}
