;; Spirograph
;; This sketch uses simple transformations to create a
;; Spirograph-like effect with interlocking circles (called sines).

:= (NUMSINES; 5); ;; how many of these things can we do at once?
:= (sines; array (NUMSINES)); ;; an array to hold all the current angles
:= (rad; void ()); ;; an initial radius value for the central sine
:= (i; void ()); ;; a counter variable

;; play with these to get a sense of what's going on:
:= (fund; 0.005); ;; the speed of the central sine
:= (ratio; 1); ;; what multiplier for speed is each additional sine?
:= (alpha; 50); ;; how opaque is the tracing system

:= (trace; false); ;; are we tracing?
setup (-> ( 
    |> (
    createCanvas();
    = (rad; * (height (); 0.25)); ;; compute radius for central circle
    background (180); ;; clear the screen
    := (i; 0);
    while (< (i; length (sines)); 
      |> ( 
       .= (sines; i; PI); ;; start EVERYBODY facing NORTH
       = (i; ++ (i))))));
);

 draw (-> (
  |> (
    ? (! (trace); |> (
      background (0); ;; clear screen if showing geometry
      stroke (255); ;; black pen
      noFill (); ;; don't fill
     )); 
    ;; MAIN ACTION
    push (); ;; start a transformation matrix
    translate ( * (width (); 0.5); * (height (); 0.5)); ;; move to middle of screen
    := (i; 0);
      while (< (i; length (sines)); 
        |> ( 
         := (erad; 0); ;; radius for small "point" within circle... this is the 'pen' when tracing
      ;; setup for tracing
        ? (trace; |> (
          stroke (0; 0; * (/ (float (i); length (sines)); 255); alpha); ;; blue
          fill (110; 20; 255; * (alpha; 0.5)); ;; also, um, blue
          = (erad;  * (5.0; - (1.0; / (float (i); length (sines))))) ;; pen width will be related to which sine
        ));
      := (radius; / (rad; ++ (i))); ;; radius for circle itself
      rotate (. (sines; i)); ;; rotate circle
      ? (! (trace); ellipse(0; 0; * (radius; 2); * (radius; 2))); ;; if we're simulating, draw the sine
      push (); ;; go up one level
      translate (0; radius); ;; move to sine edge
      ? (! (trace); ellipse(0; 0; 5; 5)); ;; draw a little circle
      ? (trace;  ellipse(0; 0; erad; erad)); ;; draw with erad if tracing
      pop (); ;; go down one level
      translate (0; radius); ;; move into position for next sine
      .= (sines; i; % (+ (. (sines; i); fund; * (fund; i; ratio)); TWO_PI)); ;; update angle based on fundamental
      = (i; ++ (i))));
      pop () ;; pop down final transformation
  )));
;; helper function for state switching 
:= (showTrace; -> (show; = (trace; show)));
