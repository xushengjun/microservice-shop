package leetcode.树.常见面试题;

import leetcode.树.TreeNode;

/**
 * 110
 * 判断是否是平衡二叉树
 */
public class isBanlenceTree_110 {
    private static boolean isBalance = true;

    public static void main(String[] args) {
        TreeNode tree = TreeNode.createTree2();
        isBanlenceTree(tree);
        System.out.println(isBalance);
    }

    /**
     * 判断树是否平衡
     * 高度差 大于 1 不平衡
     * 思路 树的高度 = max{左子树的高度, 右子树的高度}
     * @param root
     * @return
     */
    public static int isBanlenceTree(TreeNode root){
        if(root == null) return 0;
        int l = isBanlenceTree(root.left);
        int r = isBanlenceTree(root.right);
        if(Math.abs(l - r) > 1) isBalance = false;
        return Math.max(l, r) + 1;
    }
}
