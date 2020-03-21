package 面试题;

/**
 * @ClassName B
 * @Author zhaoqin
 * @Date 2020/3/16
 */
public class B {

    public void c(Object d){
        System.out.println("方法c正在执行!,参数为" + d);
    }


    public static void main(String[] args) {
        System.out.println("12133131313131".hashCode()%5000);
    }

    //默认桶(数组)的容量(长度)
    static final int DEFAULT_INITIAL_CAPACITY = 1 << 4;
    //桶(数组)的最大容量(长度)
    static final int MAXIMUM_CAPACITY = 1 << 30;
    //默认加载因子
    static final float DEFAULT_LOAD_FACTOR = 0.75f;
    //桶里面链表树形化的阈值(大于这个值，链表变红黑树)
    static final int TREEIFY_THRESHOLD = 8;
    //桶里面链形化的阈值(小于这个值，红黑树变链表)
    static final int UNTREEIFY_THRESHOLD = 6;
//    当哈希表中的容量大于这个值时，表中的桶才能进行树形化
//    否则桶内元素太多时会扩容，而不是树形化
//    为了避免进行扩容、树形化选择的冲突，这个值不能小于 4 * TREEIFY_THRESHOLD
    static final int MIN_TREEIFY_CAPACITY = 64;
}
