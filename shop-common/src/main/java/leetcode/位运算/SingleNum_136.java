package leetcode.位运算;

/**
 * 136
 * 只出现一次的数字(除了一个数字只出现过一次，其他出现偶数次)
 *
 * 异或： 0⊕0=0，1⊕0=1，0⊕1=1，1⊕1=0（同为0，异为1）
 *如果a、b两个值不相同，则异或结果为1。如果a、b两个值相同，异或结果为0。
 * 结论 ：
 *        0 异或 n = n
 *        n 异或 n = 0
 *
 */
public class SingleNum_136 {

    public static void main(String[] args) {
        int nums[] = new int[]{2, 3, 3, 4, 4};
        int i = singleNum(nums);
        System.out.println(i);
    }

    /**
     * 只出现一次的数字
     * @param nums
     * @return
     */
    public static int singleNum(int nums[]){
        int singleNum = 0;
        for(int num : nums){
            singleNum = singleNum ^ num;
        }
        return singleNum;
    }

}
