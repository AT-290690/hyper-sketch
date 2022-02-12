;; My program that I want to save
:= (w; 20);
:= (columns; void ());
:= (rows; void ());
:= (board; void ());
:= (next; void ());


:= (get_cell; -> (matrix; x; y;  [] get ([] get (matrix; x); y)));

:= (createGrid; -> (GRID_HEIGHT; GRID_WIDTH; RDM;
   |> (
   ;; initialize grid cells 
    := (grid; [] new ());
    := (j; 0); 
     ++ (< (j; GRID_HEIGHT); |> (
       := (i; 0);
       [] set (grid; j; [] new ());
       ++ ( < (i; GRID_WIDTH); |> (
           [] push ([] get (grid; j); ? (== (RDM; true); floor (random(2)); 0));
         = (i; + (i; 1))
            )
         );
       = (j; + (j; 1))
       )
      );
     grid)
));
setup ( -> ( |> (
  createCanvas ();
  ;; Calculate columns and rows
  = (columns; floor ( / (WIDTH (); w)));
  = (rows; floor ( / (HEIGHT (); w)));
  = (board; createGrid(columns; rows; true));
  ;; Going to use multiple 2D arrays and swap them
  = (next; createGrid(columns; rows; false));
)));


draw ( -> (|> (
  background(50);
  generate ();
  noLoop();
  [] forEach (board; -> (
    x; i; itemsX; 
    |> (
      [] forEach (x; -> (
        y; j; itemsY;
        |> (
          ? (== (y; 1); fill (33); fill (125));
          rect ( * (i; w); * (j; w); - (w; 1); - (w; 1));
        );
      ))
    )
  )))));
  

;; reset board when mouse is pressed
;; mousePressed ( init);

;; Fill board randomly

 
;; The process of creating the new generation
:= (generate; -> (
  |> (
    ;; Loop through every spot in our 2D array and check spots neighbors
     := (x; 1); 
       ++ (< (x; - (columns; 1)); |> (
         := (y; 1);
         ++ (< (y; - (rows; 1)); |> (
          ;; Add up all the states in a 3x3 surrounding grid
           := (neighbors; 0);
              := (i; -1); 
                 ++ (<= (i; 1); |> (
                   := (j; -1);
                   ++ (<= (j; 1); |> (
                     = (neighbors; + (neighbors; get_cell (board; + (x; i); + (y; j))));
                     = (j; + (j; 1))
                        )
                     );
                   = (i; + (i; 1))
                   )
                  );
   
           ;; Subtract the current cell's state since
           ;; we added it in the above loop
           := (cell; get_cell (board; x; y));
           = (neighbors; - (neighbors; cell));
           
           ;; Rules of Life
           
           ;;Loneliness   
           ? ( && (== (cell; 1); < (neighbors; 2)); :: update (next; 0; x; y); 
             ;; Overpopulation
             ? ( && (== (cell; 1); > (neighbors; 3)); :: update (next; 0; x; y); 
              ;; Reproduction
                ? ( && (== (cell; 0); == (neighbors; 3)); :: update (next; 1; x; y);
               ;; Stasis 
               )));
            = (y; + (y; 1))));
         = (x; + (x; 1))));
  ;; Swap
  := (temp; board);
  = (board; next);
  = (next; temp)))

)