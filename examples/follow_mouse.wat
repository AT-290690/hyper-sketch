
:= ($v1; void());
setup (-> (
  |> (
    createCanvas ();
    stroke (255;0;255);
    = ($v1; createVector (/ (WIDTH (); 2); / (HEIGHT (); 2)))
  )
));

:= ($v1; void());
setup (-> (
  |> (
    createCanvas ();
    stroke (255;0;255);
    = ($v1; createVector (/ (WIDTH (); 2); / (HEIGHT (); 2)))
  )
));

draw (-> (
  |> (
    background (0);
    line (access ($v1; "x"); access ($v1; "y"); MOUSE_X (); MOUSE_Y ());
  )
))
