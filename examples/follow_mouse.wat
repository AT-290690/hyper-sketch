
:= (v1; void());
setup (-> (
  => (
    createCanvas ();
    stroke (255;0;255);
    = (v1; createVector (/ (WIDTH (); 2); / (HEIGHT (); 2)))
  )
));

:= (v1; void());
setup (-> (
  => (
    createCanvas ();
    stroke (255;0;255);
    = (v1; createVector (/ (width (); 2); / (height (); 2)))
  )
));

draw (-> (
  => (
    background (0);
    line (. (v1; "x"); . (v1; "y"); mouseX (); mouseY ());
  )
))
