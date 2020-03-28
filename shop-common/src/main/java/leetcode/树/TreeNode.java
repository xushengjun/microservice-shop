package leetcode.树;

import sun.reflect.generics.tree.Tree;

public class TreeNode<E> {
    public TreeNode<E> left;
    public TreeNode<E> right;
    public E value;

    public TreeNode(E value) {
        this.value = value;
    }

    public TreeNode() {
    }

    ;

    public TreeNode addRight(E value) {
        TreeNode<E> node = new TreeNode<>(value);
        this.right = node;
        return node;
    }

    public TreeNode addLeft(E value) {
        TreeNode<E> node = new TreeNode<>(value);
        this.left = node;
        return node;
    }

    /**
     * 创建一颗树  测试用
     *
     * @return
     */
    public static TreeNode createTree() {
        //创建一个镜像对称的树
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_3 = new TreeNode(2);
        TreeNode node_4 = new TreeNode(3);
        TreeNode node_5 = new TreeNode(4);
        TreeNode node_6 = new TreeNode(4);
        TreeNode node_7 = new TreeNode(3);
        node_1.left = node_2;
        node_1.right = node_3;
        node_2.left = node_4;
        node_2.right = node_5;
        node_3.left = node_6;
        node_3.right = node_7;

        return node_1;
    }

    /**
     * 创建一颗树  测试用
     * 不平衡的树
     * @return
     */
    public static TreeNode createTree2() {

        TreeNode<String> tree = new TreeNode<>();
        TreeNode left = tree.addLeft("2");
//        tree.addRight("3");
        left.addLeft("4");
        TreeNode root = tree;
        return tree;
    }
}
