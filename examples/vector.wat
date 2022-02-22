 := ($mover; -> (x; y; => (
    := (vec; 
   :: (
    "pos"; createVector (x; y);
    "vel"; createVector (1; -1);
    "acc"; createVector (1; 1))
    );
    multVec (. (vec; "pos"); random (3));
    vec)));

:= ($update; -> (vec; => (
  := (pos; . (vec; "pos"));
  := (vel; . (vec; "vel"));
  := (acc; . (vec; "acc"));
  := (mouse; createVector (mouseX (); mouseY ()));
  .= (vec; "acc"; subVec (mouse; . (vec; "pos")));
  setMagVec (acc; 1);
  addVec (vel; acc);
  limitVec (vel; 5);
  addVec (pos; vel))));

:= ($show; -> (pos; => (
  stroke (255);
  strokeWeight (2);
  fill (255; 100);
  ellipse (. (pos; "x"); . (pos; "y"); 10; 10))));

:= (move);

setup (-> ( => (
    createCanvas (); 
    = (move; $mover (400; 500)))));

draw (-> ( => (
    background (30);
    $show (. (move; "pos"));
    $update (move))));
 