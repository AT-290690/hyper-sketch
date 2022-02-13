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