package leetcode.树.常见面试题;

import leetcode.树.TreeNode;

/**
 * 101 对称二叉树
 *
 * 判断一颗树是否镜像对称
 *
 *
 *     1
 *    / \
 *   2   2
 *  / \ / \
 * 3  4 4  3
 *5678 8765
 *
 * 要求
 * 1 两边高度必须一样
 * 2 两边对称节点 value必须相同
 * 3 每一层 必须所有数据对称(使用 && )
 *
 *
 */
public class isSymmetric_101 {

    public static void main(String[] args) {
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

        //
//        TreeNode node_8 = new TreeNode(5);
//        node_4.left = node_8;

        boolean isSymmetric = isSymmetric(node_1);
        System.out.println(isSymmetric);
    }

    /**
     * 判断一个树是否镜像对称
     * @param root
     * @return
     */
    public static boolean isSymmetric(TreeNode root){
        return isSymmetric(root.left, root.right);
    }

    public static boolean isSymmetric(TreeNode left, TreeNode right){
        //空节点的对称节点也是空
        if(left == null && right == null) return true;
        if(left == null || right == null) return false;

        //如果不是空 value必须相同 然后比较子节点
        if(left.value != right.value) return false;
        return isSymmetric(left.left, right.right) && isSymmetric(left.right, right.left);
    }


}
