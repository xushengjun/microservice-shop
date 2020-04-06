package leetcode.动态规划.矩阵路径;

import java.util.Arrays;

/**
 * 从左上角到右下角 矩阵最小的和
 * dp[i][j]表示从坐上角 到 当前坐标的最小矩阵路径和
 * dp[i][j] = Math.min(dp[i-1][j], d[i][j-1])
 *
 */
public class MinimumPathSum {
    public static void main(String[] args) {
        int [][] array = new int[][]{
                {1,3,1},
                {1,5,1},
                {4,2,1}
        };

        int i = minimumPathSum(array);
        System.out.println(i);

    }

    /**
     * 最小路径和
     * @return
     */
    public static int minimumPathSum(int [][] array){
        int m = array.length;
        int n = array[0].length;

        int [][] dp = new int[m][n];

        dp[0][0] = array[0][0];

        //计算 最上
        for (int j = 1; j < n; j++){
            dp[0][j] = dp[0][j-1] + array[0][j];
        }

        //计算最左
        for (int i = 1; i < m; i++){
            dp[i][0] = dp[i-1][0] + array[i][0];
        }

        //其他位置
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++){
                dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1]) + array[i][j];
            }

        return dp[m-1][n-1];
    }

}
