package 面试题;

public class Demo {

    public static void main(String[] args) {
        int division = getDivision(10);
        System.out.println(division);
    }

    public static int getDivision(int n){
        try{
            n+=1;
            if(n/0 > 0){
                n+=10;
            } else {
                n-=10;
            }
            return n;
        }catch(Exception e){
            n++;
        }
        n++;
        return n++;
    }
}
