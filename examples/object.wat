:= (num; 24);
:= (obj; 
    :: (
      "x"; + (5; 25);
      "y";  num;
      "add"; -> (arg; .= (obj; "x"; * (. (obj; "x"); arg)))
      )
    );
. (obj; "add") (5);
print (obj);