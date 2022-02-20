:= (i; 5);
:= (res);
|| (
  *? (
  < (i; 1); = (res; 1);
  < (i; 2); = (res; 10);
  > (i; 5); = (res; "sdasd");
 ); 
  = (res; + ("default"; SPACE; "case")));

print (res)