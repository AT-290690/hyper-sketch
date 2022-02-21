:= (variableEllipse; -> (x; y; px; py; => (
  := (speed; + (abs (- (x; px)); abs (- (y; py))));
  fill(50);
  stroke (speed);
  ellipse (x; y; speed);
)));

setup (-> (=> (createCanvas (); background(102)))); 
  
draw (-> (variableEllipse (mouseX (); mouseY (); pmouseX (); pmouseY ())));