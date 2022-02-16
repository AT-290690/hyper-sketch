;; Game of Life - Turing compleatness test

;; Helper functions 
:= ($Res; 20);
:= (setResolution; -> (val; = ($Res; val)));
:= (columns; void());
:= (rows; void());
:= (board; void());
:= (getCell; -> (m; x; y; accessProperty (accessProperty (m; x); y)));
:= (createGrid; -> (H; W;
     => (
     ;; initialize grid cells 
      := (grid; matrix (H; W));
       in (grid; -> (x; i; in (x; -> (y; j; 
        .= (x; j; ? (|| (
        == (i; 0); 
        == (j; 0);
        == (i; - (columns; 1));
        == (j; - (rows; 1))); 
          object ("state"; 0; "next"; 0); 
          object ("state"; floor (random(2)); "next"; floor (random(2))))))))))));
    
  setup ( -> ( => (
    createCanvas ();
    ;; Calculate columns and rows
    = (columns; floor ( / (width (); $Res)));
    = (rows; floor ( / (height (); $Res)));
    = (board; createGrid (columns; rows)))));
  
  draw ( -> (=> (
    background(50);
    generate ();
   for (:= (x; 1); - (columns; 1); => (
      for (:= (y; 1); - (rows; 1) ; => (
               := (current; getCell (board; x; y));
             ? (== (. (current; "state"); 1); fill (33); fill (125));
               rect ( * (x; $Res); * (y; $Res); - ($Res; 1); - ($Res; 1));
               .= (current; "state"; . (current; "next"));
             = (y; ++ (y))));
             = (x; ++ (x)))))));
   
  ;; The process of creating the new generation
  := (generate; -> (
    => (
      ;; Loop through every spot in our 2D array and check spots neighbors
        := (x; 1); 
         do (< (x; - (columns; 1)); => (
           := (y; 1);
           do (< (y; - (rows; 1)); => (
            ;; Add up all the states in a 3x3 surrounding grid
              := (neighbors; 0);
                 := (i; -1); 
                   do (<= (i; 1); => (
                     := (j; -1);
                     do (<= (j; 1); => (
                       := (score; getCell (board; + (x; i); + (y; j)));
                       = (neighbors; + (neighbors; . (score; "state")));
                       = (j; ++ (j))));
                     = (i; ++ (i))));
             ;; Subtract the current cell's state since
             ;; we added it in the above loop
             := (cell; getCell (board; x; y));
             = (neighbors; - (neighbors; . (cell; "state")));
             ;; Rules of Life
             ;;Loneliness   
             
             ? ( && (== (. (cell; "state"); 1); < (neighbors; 2));
               .= (cell; "next"; 0); 
               ;; Overpopulation
               ? ( && (== (. (cell; "state"); 1); > (neighbors; 3)); 
                 .= (cell; "next"; 0);
                ;; Reproduction
                  ? ( && (== (. (cell; "state"); 0); == (neighbors; 3)); 
                    .= (cell; "next"; 1);
                 ;; Stasis
                 ;; do nothing
                 )));
              = (y; ++ (y))));
           = (x; ++ (x)))))));

setResolution(25)