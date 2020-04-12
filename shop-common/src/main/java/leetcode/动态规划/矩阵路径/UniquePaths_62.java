package leetcode.动态规划.矩阵路径;

import java.util.Arrays;

/**
 * 统计一个矩形 从左上角 到 右下角 有多少种走法
 *动态规划方程 dp[i][j]表示从左上角到该坐标的所有走法
 * dp[i][j] = dp[i-1][j] + d[i][j-1]
 */
public class UniquePaths_62 {

    public static void main(String[] args) {
        int i = uniquePaths(7, 3);
        System.out.println(i);
    }

    /**
     * 走法
     * @return
     */
    public static int uniquePaths(int m, int n){
        int[][] dp = new int[m][n];
        for (int [] array : dp){
            Arrays.fill(array, 0);
        }

        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++){
                if(i == 0)
                    dp[i][j] = 1;
                else if(j == 0)
                    dp[i][j] = 1;
                else
                    dp[i][j] = dp[i-1][j] + dp[i][j-1];
            }
        return dp[m-1][n-1];
    }
}
