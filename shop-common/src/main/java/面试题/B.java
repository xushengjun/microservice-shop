package 面试题;

import java.util.HashMap;

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


//    final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
//                   boolean evict) {
//        HashMap.Node<K,V>[] tab; HashMap.Node<K,V> p; int n, i;
//        //如果数组长度是空 或者 数组是空, 就扩容
//        if ((tab = table) == null || (n = tab.length) == 0)
//            n = (tab = resize()).length;
//        // i = (n - 1) & hash 这个表达式就是根据hash计算桶的位置
//        //如果这个桶是空，创建一个新的节点
//        if ((p = tab[i = (n - 1) & hash]) == null)
//            tab[i] = newNode(hash, key, value, null);
//        else {//桶不是空，尾插法插入新的节点
//            HashMap.Node<K,V> e; K k;
//            //找到相同key的node(第一个节点)
//            if (p.hash == hash &&
//                    ((k = p.key) == key || (key != null && key.equals(k))))
//                e = p;
//            //如果是树结构，
//            else if (p instanceof HashMap.TreeNode)
//                e = ((HashMap.TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
//            else {
//                for (int binCount = 0; ; ++binCount) {
//                    //如果链表中没有相同key的，尾插法
//                    if ((e = p.next) == null) {
//                        p.next = newNode(hash, key, value, null);
//                        //如果链表长度大于等于8, 链表转红黑树
//                        if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
//                            treeifyBin(tab, hash);
//                        break;
//                    }
//                    //找到相同key的node
//                    if (e.hash == hash &&
//                            ((k = e.key) == key || (key != null && key.equals(k))))
//                        break;
//                    p = e;
//                }
//            }
//            if (e != null) { //e不是空，说明有相同的key，新值替换旧值
//                V oldValue = e.value;
//                if (!onlyIfAbsent || oldValue == null)
//                    e.value = value;
//                afterNodeAccess(e);
//                return oldValue;
//            }
//        }
//        ++modCount;//每次改变hashmap 加1
//        if (++size > threshold)// threshold默认是
//            resize();
//        afterNodeInsertion(evict);
//        return null;
//    }

}
