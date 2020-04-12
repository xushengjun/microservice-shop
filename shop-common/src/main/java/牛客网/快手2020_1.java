package 牛客网;

import leetcode.搜索.DFS.MaxArea;

import java.util.ArrayList;
import java.util.List;

public class 快手2020_1 {

    public static void main(String[] args) {
//        String s = "010";
//        String s = "abaaba";
        int [] nums = new int[]{1, 2, 3, 7, 3, 5, 1};
//        sum("11", "22");
//        listSubCharacter(s);
//        listVirus(s, 1);
    }

    /**
     * 有n个学生站成一排，每个学生有一个能力值，牛牛想从这n个学生中按照顺序选取k名学生，
     * 要求相邻两个学生的位置编号的差不超过d，使得这k个学生的能力值的乘积最大，你能返回最大的乘积吗？
     */
//    public int maxProduct(int [] nums,
//                          int k, //顺序选取k个数
//                          int w //间隔不超多w
//    ){
//        int length = nums.length;
//        int [][] dp = new int[length][length];
//        int maxProduct = 0;
//
//        for (int r = 1; r < length; r++)
//            for (int l = 0; l < r; l++){
//                int count = 0;
//
//                dp[l][r] = Math.max(dp[l][r - 1], dp[l][r - 1] * nums[l]);
//
//            }
//    }


    /**
     * 找到所有的回文字符串
     * dp[i][j] = dp[i+1][j-1] && dp[i] == dp[j]
     */
    public List<String> listPalind(String s){
        int length = s.length();
        int [][] dp = new int[length][length];
        return null;


    }

    /**
     * 以字符串的形式输入两个数字，并计算和，然后用字符串输出
     */
    public static String sum(String a, String b){
        int c = Integer.valueOf(a);
        int d = Integer.valueOf(b);
        System.out.println(String.valueOf(c + d));
        return String.valueOf(c + d);
    }
    /**
     * 双指针遍历找到所有字串
     */
    public static void listSubCharacter(String s){
        char[] chars = s.toCharArray();
        List<String> subChars = new ArrayList<>();
        int i;
        int j;
        String subChar;

        for (i = 0; i < chars.length; i++)
            for (j = i; j < chars.length; j++){
                if(i == j){
                    subChars.add(s.charAt(i) + "");
                } else {
                    subChar = s.substring(i, j + 1);
                    subChars.add(subChar);
                }
            }
        subChars.forEach(item -> System.out.println(item));
    }

    /**
     * 输入一个k 找到所有字串中包含k个1的字串
     * 思路 最左侧开始找，然后找到不是‘1’的位置再开始找
     */
    public static void listVirus(String s, int k){
        char[] chars = s.toCharArray();
        int count = 0;
        for (int i = 0; i < chars.length; i++){
            int num = 0;
            int j = i;
            int begin = 0, end = 0;

            while (j < chars.length){
                if(chars[j] == '1'){
                    num ++;
                    if(num == k){
                        begin = j;
                    }
                    if(num > k){
                        end = j;
                    }
                }
                j++;
            }

            if(j == chars.length -1 && k > num){
                break;
            }
           count += (end - begin + 1);


        }
        System.out.println(count);
    }

}
