;; Game of Life - Turing compleatness test

;; Helper functions 
:= ($Res; 20);
:= ($setResolution; -> (val; = ($Res; val)));
:= ($columns; void());
:= ($rows; void());
:= ($board; void());
:= ($getCell; -> (matrix; x; y; access (access (matrix; x); y)));
:= ($createGrid; -> (H; W;
     |> (
     ;; initialize grid cells 
      := ($grid; array (H));
       map ($grid; -> (_; i; _; map (array(W); 
         -> (_; j; _;
      ? (|| (
        == (i; 0); 
        == (j; 0);
        == (i; - ($columns; 1));
        == (j; - ($rows; 1))); object("state"; 0; "next"; 0);   object("state"; floor (random(2)); "next"; floor (random(2)))))))))));
    
  setup ( -> ( |> (
    createCanvas ();
    ;; Calculate $columns and $rows
    = ($columns; floor ( / (WIDTH (); $Res)));
    = ($rows; floor ( / (HEIGHT (); $Res)));
    = ($board; $createGrid ($columns; $rows)))));
  
  draw ( -> (|> (
    background(50);
    $generate (0; 0; 0; 0);
      := ($x; 1); 
      ... (< ($x; - ($columns; 1)); |> (
           := ($y; 1);
           ... (< ($y; - ($rows; 1)); |> (
               := ($current; $getCell ($board; $x; $y));
             ? (== (access ($current; "state"); 1); fill (33); fill (125));
               rect ( * ($x; $Res); * ($y; $Res); - ($Res; 1); - ($Res; 1));
               assign ($current; "state"; access ($current; "next"));
               = ($y; ++ ($y))));
               = ($x; ++ ($x)))))));
   
  ;; The process of creating the new generation
  := ($generate; -> (i; j; x; y;
    |> (
      ;; Loop through every spot in our 2D array and check spots neighbors
        = (x; 1); 
         ... (< (x; - ($columns; 1)); |> (
           = (y; 1);
           ... (< (y; - ($rows; 1)); |> (
            ;; Add up all the states in a 3x3 surrounding grid
              := ($neighbors; 0);
                 = (i; -1); 
                   ... (<= (i; 1); |> (
                     = (j; -1);
                     ... (<= (j; 1); |> (
                       = ($neighbors; + ($neighbors; 
                          access($getCell ($board; + (x; i); + (y; j)); "state")));
                       = (j; ++ (j))));
                     = (i; ++ (i))));
             ;; Subtract the current cell's state since
             ;; we added it in the above loop
             := ($cell; $getCell ($board; x; y));
             = ($neighbors; - ($neighbors; access($cell; "state")));
             ;; Rules of Life
             ;;Loneliness   
             
             ? ( && (== (access ($cell; "state"); 1); < ($neighbors; 2));
               assign ($cell; "next"; 0); 
               ;; Overpopulation
               ? ( && (== (access ($cell; "state"); 1); > ($neighbors; 3)); 
                 assign ($cell; "next"; 0);
                ;; Reproduction
                  ? ( && (== (access ($cell; "state"); 0); == ($neighbors; 3)); 
                    assign ($cell; "next"; 1);
                 ;; Stasis
                 ;; do nothing
                 )));
              = (y; ++ (y))));
           = (x; ++ (x)))))));


$setResolution(25)