setup (-> ( |> (
  createCanvas ();
  background (100);
  noStroke ();
  noLoop ();
  $drawCircle ( * (WIDTH (); 0.5); 280; 6))));

:= ($drawCircle; -> (x; radius; level; |> (
  ;; 'level' is the variable that terminates the recursion once it reaches 
  ;; a certain value (here, 1). If a terminating condition is not 
  ;; specified, a recursive function keeps calling itself again and again
  ;; until it runs out of stack space - not a favourable outcome! 
  := ($tt; * (* (126; level); 0.25));
  fill ($tt);
  ellipse (x; * (HEIGHT (); 0.5); * (radius; 2); * (radius; 2));
  ? ( > (level; 1); 
   ;; 'level' decreases by 1 at every step and thus
   ;;  makes the terminating condition attainable
   |> ( = (level; - (level; 1));
    $drawCircle ( - (x; * (radius; 0.5)); * (radius; 0.5); level);
    $drawCircle ( + (x; * (radius; 0.5)); * (radius; 0.5); level))))))