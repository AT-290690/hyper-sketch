:= ($obj; object 
           ("x"; 10;
            "y"; 25;
            "z"; 25));
:= ($arr; overwrite (array (3); 1; 2));
assign ($arr; 2; 10);
addAtEnd ($arr; removeFromStart ($arr));
print ($obj; map ($arr; -> (x; i; a; * (x; *(x; ++(i))))));

:= ($toggle; -> (=($trace; !($trace))));
:= ($recursiveToggle; -> (time;
setTimeout (-> (
 |> (
     $toggle();
     $recursiveToggle(time);
 )
); time)
));

:= ($safeLoop; -> (i; end; fn; |> ( ? (< (i; end); ... (< (i; end); |> (fn(i); = (i; ++ (i))))))));
$safeLoop (0; 5; -> (i; print (i)));

:= ($arr; array ());
for (10; 0)(-> (i; 
  addAtEnd ($arr; i)
));
print ($arr);


:= ($i; 0);
@ (0; 10; |> (
  print ($i);
  = ($i; ++ ($i))));

:= ($matrix; matrix (5; 5; 5));
in ($matrix; -> (x; i; in (x; -> (y; j; *=(x; j; +(i; j))))));
print ($matrix);

:= ($arr; in (matrix (5; 5); -> (x; i; in (x; -> (y; j; *= (x; j; 10))))));
print ($arr);

:= (start; 2);
:= (end; 15);
@ (start; end; print("*"))