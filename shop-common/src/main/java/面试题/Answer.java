package 面试题;

/**
 * java工程是面试题——题目c   meeapp面试
 */
public class Answer {

    public static void main(String[] args) {
//        int num[] = new int[]{7, 1, 5, 3, 6, 4};
        int num[] = new int[]{1, 2};
        int i = sellStocks(num);
        System.out.println(i);
    }

    /**
     * 卖股票 求最大利润
     */
    public static int sellStocks(int num[]){
        int maxProfit = 0;
        for (int i = 0; i < num.length - 1; i++){
            int temp = num[i];
            for (int j = i + 1; j < num.length; j++){
                if(temp >= num[j])
                    continue;
                else if( (num[j] - num[i]) > maxProfit )
                    maxProfit = num[j] - num[i];
            }
        }
        return maxProfit;
    }
}
