package leetcode.动态规划.斐波那契;

/**
 * 198
 * 强盗抢劫
 */
public class HouseRobbe_198 {

    public static void main(String[] args) {
        int num[] = new int[]{2, 7, 9, 3, 1};
        int i = houseRobbe(num);
        System.out.println(i);

    }

    /**
     * dp方程
     * dp[i]表示某个位置的最大金额
     * dp[i] = max(dp[i-2] +num[i], d=dp[i-1])
     * 使用 prev1 prev2 分别记录这两个最值变量
     * pre1 记的是dp[i-2] +num[i]
     * pre2 记得是dp[i-1]
     */
    public static int houseRobbe(int num[]){
        int prev1 = num[0]; int prev2 = 0; int max = 0;
        for(int i = 1; i < num.length; i++){
            max = Math.max(prev1, prev2);
            prev1 = prev2 + num[i];
            prev2 = max;
        }
        return max;
    }
}
