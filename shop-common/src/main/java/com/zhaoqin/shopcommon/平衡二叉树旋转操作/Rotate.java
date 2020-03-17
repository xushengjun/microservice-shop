package com.zhaoqin.shopcommon.平衡二叉树旋转操作;

/**
 *
 * 树的旋转
 * 单旋转(LL  RR) 和  双旋转(LR RL )
 *
 * @ClassName Rotate
 * @Author zhaoqin
 * @Date 2020/3/16
 */
public class Rotate {


    /**
     * RR 或者 LL
     *
     * 插入9
     *                     3
     *                  x      6
     *                       y    z
     *
     * 变换之后
     *                  3
     *              x       6
     *                    y    9
     *
     *                 6
     *              3     9
     *            x   y
     *
     * 变化  假设 3 为 root
     * 1. 3的高度减1
     * 2. 6的高度加1
     * 3. y挂在了3的右子树
     * 4. 3挂在6的左子树
     */
    public void RrType(Node root){
        Node temp = root.right;
        Node y = temp.left;
        temp.left = root;
        root.right = y;//
        temp.heigth = temp.heigth + 1;//3的高度减1
        root.heigth = root.heigth -1;// 6的高度加1
    }

    /**
     * 双旋转
     * LR 或 RL
     *
     * 插入 b c 时
     *              k1
     *           a       k2
     *               k3      d
     *             b    c
     *
     *
     *  第一次旋转
     *                  k1
     *               a       k3
     *                    b      k2
     *                         c       d
     *
     * 变化
     * 1. k2 挂在 k3 右子树
     * 2. c挂在k2 左边
     * 3. k2高度减1
     * 4. k3高度加1
     *
     *
     * 第二次 旋转
     *
     *                  K3
     *              K1      K2
     *            a    b   c    d
     * 1 k3 高度加 1
     * 2 b挂在k1 右边
     * 3 k2高度加 1
     *
     */
    public void RL(Node root){
        //第一次
        Node k2 = root.right;
        Node k3 = root.right.left;
        Node c = k3.right;
        root.right = root.right.left;
        k3.right = k2;
        k2.left = c;

        //第二次
       // 略

    }


    class Node{
        public Node parent;//父节点
        public Node left;//左节点
        public Node right;//右节点
        public int value;//值
        public int heigth;//高度

    }


}
