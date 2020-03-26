package 树的旋转;

import java.util.HashMap;

public class roateLeft {

    /* -------------------------------------------------  */
    //  分析红黑树的左旋转

    /*
    static <K,V> HashMap.TreeNode<K,V> rotateLeft(HashMap.TreeNode<K,V> root,//root 整个树的根
                                                  HashMap.TreeNode<K,V> p // p 为旋转树的根
                                                  ) {
        HashMap.TreeNode<K,V> r, pp, rl;

        if (p != null && (r = p.right) != null) { // r ： p的右节点  1 取出右节点

            if ((rl = p.right = r.left) != null) //2 把 右节点(r)的左节点(rl)放到p的右节点（即覆盖掉原来的r  r与p 断开）
                rl.parent = p;   //更改rl中的父母为p

                                                      //3 因为r变为旋转树的根 所以 p原来的父母就是现在r的父母
            if ((pp = r.parent = p.parent) == null)//  判断p的父母是否是空（即是否是整个树的根） 如果是 r为整个树的根（root）
                (root = r).red = false;            //

            else if (pp.left == p)  // 4 判断这个旋转树是他们父母的左儿子还是右儿子 并赋值
                pp.left = r;
            else
                pp.right = r;


            r.left = p; //5 最后把r 和 p连接  p变成r的左儿子  并修改p的父母为r
            p.parent = r;
        }
        return root;
    }

     */


    /* -----------------------------------  */
    // 右旋转

    /*

    static <K,V> HashMap.TreeNode<K,V> rotateRight(HashMap.TreeNode<K,V> root,
                                                   HashMap.TreeNode<K,V> p) {
        HashMap.TreeNode<K,V> l, pp, lr;
        if (p != null && (l = p.left) != null) { // 1 记录 p的左节点（因为要断开）

            if ((lr = p.left = l.right) != null) // 2 lr的右节点变为p的左节点
                lr.parent = p;

            if ((pp = l.parent = p.parent) == null) // 判断p的父母是否存在 、p的父母的左孩子是p、还是p父母的右边孩子是p  并做出相关链接操作
                (root = l).red = false;
            else if (pp.right == p)
                pp.right = l;
            else
                pp.left = l;


            l.right = p;   //最后 链接 p 和 l（旋转树新的根）
            p.parent = l;
        }
        return root;
    }


     */
}
