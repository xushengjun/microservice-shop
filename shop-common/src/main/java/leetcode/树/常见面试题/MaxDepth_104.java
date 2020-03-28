package leetcode.树.常见面试题;


import leetcode.树.TreeNode;

public class MaxDepth_104 {
    public static void main(String[] args) {
        TreeNode<String> tree = new TreeNode<>();
        TreeNode left = tree.addLeft("2");
        tree.addRight("3");
        left.addLeft("4");
        TreeNode root = tree;

        MaxDepth_104 maxDepth = new MaxDepth_104();
        System.out.println(maxDepth.getMaxDepth(root));

    }

    public int getMaxDepth(TreeNode root){
        if(root == null) return 0;
        return Math.max(getMaxDepth(root.left), getMaxDepth(root.right)) + 1;
    }

}
