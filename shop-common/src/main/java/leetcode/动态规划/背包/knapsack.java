package leetcode.动态规划.背包;

/**
 * 重量 weights  2 3 4 5 9
 * 价格 values 3 4 5 8 10
 *
 * 给定一个总体积 W
 * 给定一个数量 N
 * dp[N+1][v+1] 一个二维数组
 * dp[i][j]表示 给定i个商品 总体积j的情况下（即i个商品，总体积不超过j）最大利润
 * dp[i][j] = max(dp[i-1][j],dp[i-1][w]
 */
public class knapsack {
}
