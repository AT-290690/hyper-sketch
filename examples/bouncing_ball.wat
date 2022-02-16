:= (x; 100);
:= (y; 280);
:= (xspeed; 5);
:= (yspeed; 2);
:= (r; 15);

setup (-> ( => (
  createCanvas ();
)));
draw (-> (=> (
  background( 0);
  ellipse (x; y; r);
  = (x; + (x; xspeed));
  = (y; + (y; yspeed));
 ? ( || (< (x; r); > (x; - ( width (); r))); = (xspeed; * (xspeed; -1)));
 ? ( || (< (y; r); > (y; - ( height (); r))); = (yspeed; * (yspeed; -1)));
)))
