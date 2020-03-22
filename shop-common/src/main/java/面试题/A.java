package 面试题;

import java.util.HashMap;

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


//    // resize 新创建一个map(不带参数)的时候，不会执行这个方法，只有当map插入第一个元素的时候，才会resize
//    // resize 当map的容量大于16 * 0.75（默认） 执行resize
//    final HashMap.Node<K,V>[] resize() {
//        HashMap.Node<K,V>[] oldTab = table;//table就是数组
//        int oldCap = (oldTab == null) ? 0 : oldTab.length;
//        //旧的阈值，这个阈值主要是评估是否扩容
//        int oldThr = threshold;
//        int newCap, newThr = 0;
//        if (oldCap > 0) {
//            if (oldCap >= MAXIMUM_CAPACITY) {
//                threshold = Integer.MAX_VALUE;
//                return oldTab;
//            }
//            else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
//                    oldCap >= DEFAULT_INITIAL_CAPACITY)
//                //每次扩容乘以2
//                newThr = oldThr << 1; // double threshold
//        }
//        else if (oldThr > 0) // initial capacity was placed in threshold
//            newCap = oldThr;
//        else {               // zero initial threshold signifies using defaults
//            //创建空map，容量为0 旧阈值都是0的时候，初始化默认配置
//            newCap = DEFAULT_INITIAL_CAPACITY;//默认容量
//            newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);//默默人阈值
//        }
//        if (newThr == 0) {
//            float ft = (float)newCap * loadFactor;
//            newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
//                    (int)ft : Integer.MAX_VALUE);
//        }
//        //新阈值赋值
//        threshold = newThr;
//        @SuppressWarnings({"rawtypes","unchecked"})
//        //根据扩容后的容量创建一个新的数组
//        HashMap.Node<K,V>[] newTab = (HashMap.Node<K,V>[])new HashMap.Node[newCap];
//        //替换旧的数组
//        table = newTab;
//        //把旧的map的值放进新的map
//        if (oldTab != null) {
//            for (int j = 0; j < oldCap; ++j) {
//                HashMap.Node<K,V> e;
//                if ((e = oldTab[j]) != null) {
//                    oldTab[j] = null;
//                    if (e.next == null)
//                        newTab[e.hash & (newCap - 1)] = e;
//                    else if (e instanceof HashMap.TreeNode)
//                        ((HashMap.TreeNode<K,V>)e).split(this, newTab, j, oldCap);
//                    else { // preserve order
//                        HashMap.Node<K,V> loHead = null, loTail = null;
//                        HashMap.Node<K,V> hiHead = null, hiTail = null;
//                        HashMap.Node<K,V> next;
//                        do {
//                            next = e.next;
//                            if ((e.hash & oldCap) == 0) {
//                                if (loTail == null)
//                                    loHead = e;
//                                else
//                                    loTail.next = e;
//                                loTail = e;
//                            }
//                            else {
//                                if (hiTail == null)
//                                    hiHead = e;
//                                else
//                                    hiTail.next = e;
//                                hiTail = e;
//                            }
//                        } while ((e = next) != null);
//                        if (loTail != null) {
//                            loTail.next = null;
//                            newTab[j] = loHead;
//                        }
//                        if (hiTail != null) {
//                            hiTail.next = null;
//                            newTab[j + oldCap] = hiHead;
//                        }
//                    }
//                }
//            }
//        }
//        return newTab;
//    }

}
