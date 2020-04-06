package leetcode.动态规划.斐波那契;

/**
 * 70
 * 爬楼梯
 * 要求使用两种方法
 * 第一种递归 考察递归
 * 第二种非递归 要求空间复杂度o(1) 考察记忆
 *
 *
 */
public class ClimbingStairs_70 {

    public static void main(String[] args) {
        //输入楼梯数目
        int i = climbingStairs(5);
        System.out.println(i);
        int i1 = climbingStairs2(5);
        System.out.println(i1);
    }

    /**
     * 方法1  非递归
     * 考察记忆
     * dp[i] = dp[i-1] dp[i-2]
     */
    public static int climbingStairs(int n){
        if(n == 1 ) return 1;
        if(n == 2) return  2;

        int pre1 = 1; int pre2 = 2; int sum = 0;
        for(int i = 2; i < n; i++){
            sum = pre1 + pre2;
            pre1 = pre2;
            pre2 = sum;
        }
        return sum;
    }

    /**
     * 考察递归
     * @param n
     * @return
     */
    public static int climbingStairs2(int n) {
        if(n == 1) return 1;
        if(n == 2) return 2;
        return climbingStairs(n - 1 ) + climbingStairs(n - 2 );

    }
}
