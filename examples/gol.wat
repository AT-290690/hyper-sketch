|> (
        ;; CONSTANTS 
        := (GRID_WIDTH; 35);
        := (GRID_HEIGHT; 35);
        := (GRID_CELL_SIZE; 5);
        := (GRID_STATE_ALIVE; 1);
        := (GRID_STATE_DEAD; 0);
        := (GRID_COLOR_ALIVE; "#444444");
        := (GRID_COLOR_DEAD; "#dddddd");
        := (RANDOM_FACTOR; 30);

        := (create_cell; -> (x; y; |> (object (entries ("x"; x; "y"; y; "state"; GRID_STATE_DEAD; "next_state"; GRID_STATE_DEAD; "color_index"; 0)))));
        := (is_alive; -> (cell; == (object_access (cell; "state"); GRID_STATE_ALIVE)));
        := (pixel_width; * (GRID_WIDTH; GRID_CELL_SIZE));
        := (pixel_height; * (GRID_HEIGHT; GRID_CELL_SIZE));
        := (set_state; -> (cell; state; |> (object_assign (cell; "state"; state); object_assign (cell; "next_state"; state))));
        := (set_next_state; -> (cell; state; object_assign(cell; "next_state"; state)));
        := (switch_state; -> (cell; object_assign (cell; "state"; object_access (cell; "next_state"))));
        := (is_same_cell; -> (a; b; == (a; b)));
        := (grid_get_cell; -> (grid; x; y; get (grid; + (x; * (y; GRID_HEIGHT)))));
        

        := (create_grid; -> (
                 |> (
                 ;; initialize grid cells 
                  := (grid; create_array());
                  := (j; 0); 
                   loop (< (j; GRID_HEIGHT); |> (
                     := (i; 0);
                     loop (< (i; GRID_WIDTH); |> (
                        set (grid; + (i; * (j; GRID_HEIGHT)); create_cell (i; j));
                          = (i; + (i; 1))
                          )
                       );
                     = (j; + (j; 1))
                     )
                    );
                   grid)
              ));
      
        ;; function that paints that paints each cell according to cell state
        := (draw; -> (ctx; cell; |> (
            := (x; * (object_access(cell; "x"); GRID_CELL_SIZE));
            := (y; * (object_access(cell; "y"); GRID_CELL_SIZE));
            fill_style (ctx; ? (is_alive(cell); GRID_COLOR_ALIVE; GRID_COLOR_DEAD));
            fill_rect (ctx; x; y; GRID_CELL_SIZE; GRID_CELL_SIZE))));
      
        ;; function that resolves game of life rule set
        := (count_live_neighbors; -> (cell; grid; |> (
           := (live_count; 0);
           := (i; -1); 
           loop (< (i; 2); |> (
             := (j; -1);
             loop ( < (j; 2); |> (
                 := (dx; % (+ (object_access(cell; "x"); i); GRID_WIDTH)); 
                 := (dy; % (+ (object_access(cell; "y"); j); GRID_HEIGHT));
                 := (current_cell; grid_get_cell (grid; dx; dy));
                 ;; if current cell is not ouf of bounds and is alive - increment live neighbors
                 ? (&& (current_cell; is_alive(current_cell); ! (is_same_cell (cell; current_cell))); = (live_count; + (live_count; 1)));
                  = (j; + (j; 1))
                  )
               );
             = (i; + (i; 1))
             )
            );
            live_count)));
      ;; function that updates the state
      := (update; -> (ctx; grid; |> (
               clear_rect(ctx; 0; 0; pixel_width; pixel_height);
               := (x; 0); 
               loop (< (x; GRID_WIDTH); |> (
                 := (y; 0);
                 loop (< (y; GRID_HEIGHT); |> (
                      := (cell; grid_get_cell (grid; x; y));
                      switch_state (cell);
                      draw (ctx; cell);
                      := (live; count_live_neighbors (cell; grid));
                     ? (&& (is_alive (cell); || (< (live; 2); > (live; 3))); set_next_state (cell; GRID_STATE_DEAD); 
                       ? (== (live; 3); set_next_state (cell; GRID_STATE_ALIVE)));
                      = (y; + (y; 1))
                     )
                   );
                 = (x; + (x; 1)))))));

       := (randomize; -> (grid; chance_to_live; |> (
          := (chance; - (100; chance_to_live));
          := (x; 0); 
           loop (< (x; GRID_WIDTH); |> (
             := (y; 0);
             loop (< (y; GRID_HEIGHT); |> (
                  := (cell; grid_get_cell (grid; x; y));
                  := (rand; + (1; floor (random (+ (100; 1)))));
                  := (alive; > (rand; chance));
                  set_state (cell; ? (alive; GRID_STATE_ALIVE; GRID_STATE_DEAD));
                  = (y; + (y; 1))
                  )
               );
             = (x; + (x; 1)))))));
    
       := (init; -> (
           |> (
            := (ctx; get_context ());
            clear (ctx);
            := (my_grid; create_grid ());
            randomize (my_grid; RANDOM_FACTOR);
            clear_rect(ctx; 0; 0; WIDTH; HEIGHT);
            := (step; -> (|> (update(ctx; my_grid); animate (step))));
            animate (step);
       )));
        init()
      )