package leetcode.树.常见面试题;

import leetcode.树.TreeNode;

/**
 * 100
 * 相同的树
 * 比较两个二叉树相同(和判断树是否对称思路一样  101 )
 */
public class isSameTree_100 {

    public static void main(String[] args) {
        TreeNode tree1 = TreeNode.createTree();
        TreeNode tree2 = TreeNode.createTree();
        System.out.println(isSameTree(tree1, tree2));
    }


    /**
     * 判断两颗树是否相同
     * @param root1
     * @param root2
     * @return
     */
    public static boolean isSameTree(TreeNode root1, TreeNode root2){
        if(root1 == null && root2 == null) return true;
        if(root1 == null || root2 == null) return false;
        if(root1.value == root2.value)
            return isSameTree(root1.left, root2.left) && isSameTree(root1.right, root2.right);
        else
            return false;
    }
}
