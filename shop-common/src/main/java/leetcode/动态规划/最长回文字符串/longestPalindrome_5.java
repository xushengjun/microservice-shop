package leetcode.动态规划.最长回文字符串;

/**
 * 最长回文串
 * 一个字符串倒置还是他本身
 * 思路
 * dp[i][j] = dp[i+1][j-1] and dp[i] == dp[j]
 * i j 是字符串的下标   dp[i][j] 表示数组下标i到j是一个回文字符串
 *
 */
public class longestPalindrome_5 {
    public static void main(String[] args) {
        longestPalind("abaaba");
    }

    /**
     * 最长回文字符串
     */
    public static String longestPalind(String s){
        int length = s.length();
        int maxLength = 0;//记录最长回文字符串的长度
        int begin = 0;//记录最长回文串的前置下标
        int end = 0;//记录最长回文串的后置下标
        boolean [][] dp = new boolean[length][length];

        for (int i = 1; i < length; i++)
            for (int j = 0; j < i; j++){
                if (s.charAt(i) == s.charAt(j) && ( i - j <= 2 || dp[j + 1][i - 1])){
                    dp[j][i] = true;
                    if((i - j) > maxLength) {
                        begin = j; end = i;
                        maxLength = i - j;
                    }
                }
            }

        //打印所有的回文字符串
       for (int i = 0; i < length; i++)
           for (int j = 0; j < length; j++){
               if(dp[i][j]){
                   System.out.println(s.substring(i, j + 1));
               }

           }


        String longestPalind = s.substring(begin, end + 1);
        System.out.println(longestPalind);
        return longestPalind;
    }
}
