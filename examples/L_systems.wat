;; TURTLE STUFF:
:= (x); := (y); ;; the current position of the turtle
:= (currentangle; 0); ;; which way the turtle is pointing
:= (step; 20); ;; how much the turtle moves with each 'F'
:= (angle; 90); ;; how much the turtle turns with a '-' or '+'

;; LINDENMAYER STUFF (L-SYSTEMS):
:= (thestring; "A"); ;; "axiom" or start of the string
:= (numloops; 5); ;; how many iterations to pre-compute
:= (therules; array ()); ;; array for rules
.= (therules; 0; overwrite (array (); "A"; "-BF+AFA+FB-")); ;; first rule
.= (therules; 1; overwrite (array (); "B"; "+AF-BFB-FA+")); ;; second rule
print (therules);
:= (whereinstring; 0); ;; where in the L-system are we?
setup (-> (
  => (
   createCanvas ();
   background(255);
   stroke(0; 0; 0; 255);
  ;; start the x and y position at lower-left corner
  = (x; 0);
  = (y; - (height; 1));
    
  ;; COMPUTE THE L-SYSTEM
  := (i; 0); ++? (< (i; numloops); => (
    = (thestring; lindenmayer (thestring));
    +=(i)))))); 
  
draw (-> (
  => (
    ;; draw the current character in the string:
    drawIt (. (thestring; whereinstring));
    ;; increment the point for where we're reading the string.
    ;; wrap around at the end.
    += (whereinstring);
    ? (> (whereinstring; - (length (thestring); 1));
      = (whereinstring; 0)))));

;; interpret an L-system
:= (lindenmayer; -> (s; => (
  := (outputstring; ""); ;; start a blank output string
  ;; iterate through 'therules' looking for symbol matches:
  := (i; 0); ++? (< (i; length (s)); => (
    := (ismatch; 0); ;; by default, no match
    := (j; 0); ++? (< (j; length (therules)); => (
      ? (== (. (s; i); . (. (therules; j); 0)); => (
        += (outputstring; . ( . (therules; j); 1)); ;; write substitution
        = (ismatch; 1); ;; we have a match, so don't copy over symbol
        = (j; length (therules))
      ));
    +=(j)));
        ;; if nothing matches, just copy the symbol over.
        ? (== (ismatch;0); += (outputstring; . (s; i)));
    += (i)));
 outputstring ;; send out the modified string
)));

;; this is a custom function that draws turtle commands

:= (drawIt; -> (k; => (

? (== (k; "F"); ;; draw forward 
  => (
   ;; polar to cartesian based on step and currentangle:
   := (x1; + (x; * (step; cos (radians (currentangle)))));
   := (y1; + (y; * (step; sin (radians (currentangle)))));
   line (x; y; x1; y1); ;; connect the old and the new

   ;; update the turtle's position:
    = (x; x1);
    = (y; y1);
  );
 ? ( == (k; "+"); 
     += (currentangle; angle); ;; turn left 
 ? (== (k; "-"); 
     -= (currentangle; angle) ;; turn right
     )
 ));
  ;; give me some random color values:
  := (r; random(128; 255));
  := (g; random (0; 192));
  := (b; random (0; 50));
  := (a; random (50; 100));

  ;; pick a gaussian (D&D) distribution for the radius:
  := (radius; 0);
  += (radius; random (0; 15));
  += (radius; random (0; 15));
  += (radius; random (0; 15));
  = (radius; / (radius; 3));

  ;; draw the stuff:
  fill (r; g; b; a);
  ellipse (x; y; radius);
  )
))

