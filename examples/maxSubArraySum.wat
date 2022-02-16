:= (maxSubArray; -> (nums; => (
  := (maxSoFar; . (nums; 0));
  := (maxGlobal; maxSoFar);
  ++ (:= (i; 1); - (length (nums); 1); => (
    = (maxGlobal; 
        max (maxGlobal; 
            = (maxSoFar; max (0; + (maxSoFar; . (nums; i))))));
    += (i))); maxGlobal)));
print (maxSubArray (overwrite (array (); 1; -2; 10; -5; 12; 3; -2; 3; -199; 10)));