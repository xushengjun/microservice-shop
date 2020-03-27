package leetcode.动态规划.最大收益;

/**
 * 动态规划
 * 第i天的最大收益 = max{ 前i-1天的最大收益 , 第i天的价格 - 前i-1的最小价格}
 */
public class maxProfit {

    public static void main(String[] args) {
        int num1[] = new int[]{1, 2};
        int num2 [] = new int[]{7, 1, 5, 3, 6, 4};
        System.out.println(maxProfit(num1));
        System.out.println(maxProfit(num2));
    }

    /**
     * 最大利润
     * @return
     */
    public static int maxProfit(int num[]){

        if(num.length <= 1)//如果只有一只股票 没有利润
            return 0;

        int max = 0;//最大利润
        int min = num[0];//最小价格
        for(int i = 1; i < num.length; i++){
                max = Math.max(max, num[i] - min);
                min = Math.min(min, num[i]);
            }
        return max;
    }
}
