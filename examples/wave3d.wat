:= (angle; 0);
:= (w; 24);
:= (ma);
:= (maxD);
:= (PI; 3.14159265359);
:= (QUARTER_PI; * (PI; 0.25));
setup (-> (
  => (
    createWebGlCanvas();
    = (ma; atan (cos (QUARTER_PI)));
    = (maxD; dist (0; 0; 200; 200))
))); 
   
draw (-> (
  => (
    background (0);
    ortho(* (-1; width ()); width (); width (); * (-1; width ()); 0; 1000);
    rotateX(* (ma; -1));
    rotateY(* (QUARTER_PI; -1));
    := (z; 0);
   ++? (< (z; height ()); => (
      := (x; 0);
      ++? (< (x; width ()); => (
        push();
        := (d; dist (x; z; * (width (); 0.5); * (height (); 0.5)));
        := (offset; remap (d; 0; maxD; * (-1; PI); PI));
        := (a; + (angle; offset));
        := (h; floor (remap (sin (a); -1; 1; 100; 300)));
        translate (- (x; * (width (); 0.5)); 0; - (z; * (height (); 0.5)));
        normalMaterial ();
        stroke (125; 250; 120);
        noFill ();
        box (w; h; w);
        pop ();
         += (x; w);
      ); 
      );+= (z; w);));

  -=(angle; 0.1);
)));

