package leetcode.树.常见面试题;

import leetcode.树.TreeNode;

/**
 * 将一个有序数组转化为一个二叉搜索树
 * 思路 中序遍历是一个升序序列，利用中序遍历生成树
 */
public class SortedArrayToBST {

    private static int num[]  = new int[]{-10, -3, 0, 5, 9};

    public static void main(String[] args) {
        int left = 0;
        int right = num.length - 1;
        sortedArrayToBST(left, right);
    }

    /**
     * 有序数组 转化为 二叉搜索树
     * 思路：有很多方法 生成的二叉树也非常多
     * 本文思路：总是选择中间节点作为根节点
     */
    public static TreeNode sortedArrayToBST(int left, int right){
        if(left > right) return null;

        int mid = (left + right)/2;
        TreeNode tree = new TreeNode(num[mid]);
        tree.left = sortedArrayToBST(left, mid - 1);
        tree.right = sortedArrayToBST(mid + 1, right);
        return tree;
    }



}
