:= (node; -> (val; :: (
    "val"; val;
    "next"; void ())));

:= (next; -> (list; node; => (
  := (tail; list);
  ++? (!= (. (tail;"next"); void ()); = (tail; . (tail; "next")));
  := (newNode; node);
  .= (tail; "next"; newNode);
)));

:= (myList; node (1));
next (myList; node (2));
next (myList; node (3));
next (myList; node (4));
:= (t; . (myList; "next"));
.= (myList; "next"; . (t; "next"));
print(myList);