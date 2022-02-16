:= (angle; * (PI; 0.2));

setup (-> (
  => (
    createCanvas();
  )
));

draw ( -> (
  => (
    background (0);
    stroke (10; 130; 170);
    translate (* (width (); 0.5); height ());
    branch (100);
  )
));

:= (branch; -> (len; => (
  line (0; 0; 0; * (len; -1));
  translate (0; * (len; -1));
  ? ( > (len; 10); => (
    push ();
    rotate (angle);
    branch (* (len; 0.75));
    pop ();
    push ();
    rotate (* (angle; -1));
    branch (* (len; 0.75));
    pop ();
  ))
)))