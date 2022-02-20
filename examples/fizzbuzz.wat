in ( range (1; 30); -> (x; i; print(
  ? (== (% (x; 15); 0); "FizzBuzz";
  ? (== (% (x; 3); 0); "Fizz"; 
  ? (== (% (x; 5); 0); "Buzz";  x))))))
  
in ( range (1; 30); -> (x; i; 
  || (*? (
   == (% (x; 15); 0); print ("FizzBuzz");
   == (% (x; 3); 0); print ("Fizz"); 
   == (% (x; 5); 0); print ("Buzz")); 
   print(x))))
