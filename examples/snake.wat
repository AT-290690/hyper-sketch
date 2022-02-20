;; the snake is divided into small segments, which are drawn and edited on each 'draw' call
:= (numSegments; 10);
:= (direction; "right");

:= (xStart; 250); ;; starting x coordinate for snake
:= (yStart; 250); ;; starting y coordinate for snake
:= (diff; 10);

:= (xCor; array ());
:= (yCor; array ());

:= (xFruit; 150);
:= (yFruit; 150);
:= (scoreElem);

setup (-> (=> (
   createCanvas ();
   frameRate (15);
    stroke(200);
  
   strokeWeight (10);
   updateFruitCoordinates ();
   ++ (:= (i; 0); numSegments; => (
     addAtEnd (xCor; + (xStart; * (i; diff)));
     addAtEnd (yCor; yStart);
     +=(i)))))); 

draw (-> (
  => (
     background (0);
    ++ (:= (i; 0); numSegments; line (. (xCor; i); . (yCor; i); . (xCor; + (i; 1)); . (yCor; + (i; 1))));
    updateSnakeCoordinates ();
    checkGameStatus ();
    checkForFruit ())));

 ;; The segments are updated based on the direction of the snake.
 ;; All segments from 0 to n-1 are just copied over to 1 till n, i.e. segment 0
 ;; gets the value of segment 1, segment 1 gets the value of segment 2, and so on,
 ;; and this results in the movement of the snake.

 ;; The last segment is added based on the direction in which the snake is going,
 ;; if it's going left or right, the last segment's x coordinate is increased by a
 ;; predefined value 'diff' than its second to last segment. And if it's going up
 ;; or down, the segment's y coordinate is affected.

:= (updateSnakeCoordinates; -> ( 
  
  ++ (:= (i; 0); - (numSegments; 1); => (
  .= (xCor; i; . (xCor; + (i; 1)));
  .= (yCor; i; . (yCor; + (i; 1)));
  
  *? (
    == (direction; "right"); => (
    .= (xCor; - (numSegments; 1); + (. (xCor; - (numSegments; 2)); diff));
    .= (yCor; - (numSegments; 1); . (yCor; - (numSegments; 2)))
  ); 
    == (direction; "up"); => (
    .= (xCor; - (numSegments; 1); . (xCor; - (numSegments; 2)));
    .= (yCor; - (numSegments; 1); - (. (yCor; - (numSegments; 2)); diff));
  );
    == (direction; "left"); => (
    .= (xCor; - (numSegments; 1); - (. (xCor; - (numSegments; 2)); diff));
    .= (yCor; - (numSegments; 1); . (yCor; - (numSegments; 2)));
  );
    == (direction; "down"); => (
    .= (xCor; - (numSegments; 1); . (xCor; - (numSegments; 2)));
    .= (yCor; - (numSegments; 1); + (. (yCor; - (numSegments; 2)); diff))))))));

 ;; I always check the snake's head position xCor[xCor.length - 1] and
 ;; yCor[yCor.length - 1] to see if it touches the game's boundaries
 ;; or if the snake hits itself.
 := (checkGameStatus; -> (
   => (
     := (x; - (length (xCor; 1)));
     := (y; - (length (yCor; 1)));
  ? (
   || (
     > (. (xCor; x); width ());
     < (. (xCor; x); 0);
     > (. (yCor; y); height ());
     < (. (yCor; y); 0);
     checkSnakeCollision ()
     ); noLoop ();
   ))));

 ;; If the snake hits itself, that means the snake head's (x,y) coordinate
 ;; has to be the same as one of its own segment's (x,y) coordinate.
 := (checkSnakeCollision; -> ( => (
     := (x; - (length (xCor; 1)));
     := (y; - (length (yCor; 1)));
   := (snakeHeadX; . (xCor; x));
   := (snakeHeadY; . (yCor; y));
   := (res; 0);
   ++ (:= (i; 0); x; => (
     ? (&& (== (. (xCor; i); snakeHeadX); == (. (yCor; snakeHeadY))); = (res; 1));
     += (i))); res)));

 ;; Whenever the snake consumes a fruit, I increment the number of segments,
 ;; and just insert the tail segment again at the start of the array (basically
 ;; I add the last segment again at the tail, thereby extending the tail)
:= (checkForFruit; -> (=> (
  point (xFruit; yFruit);
    := (x; - (length (xCor; 1)));
     := (y; - (length (yCor; 1)));
  ? (
    && (
      == (. (xCor; x); xFruit);
      == (. (yCor; y); yFruit)
    );
    => (
    unshift (. (xCor; 0));
    unshift (. (yCor; 1));
    += (numSegments);
    updateFruitcoordinates ()
    )))));
  
:= (updateFruitCoordinates; -> (
 ;; The complex math logic is because I wanted the point to lie
 ;; in between 100 and width-100, and be rounded off to the nearest
 ;; number divisible by 10, since I move the snake in multiples of 10.
 => (
 := (xFruit; floor ( * (random (10; / ( - (width (); 100); 10)); 10)));
 := (yFruit; floor ( * (random (10; / ( - (height (); 100); 10)); 10)))
 )));  

keyPressed (-> (key; 
  *? (
      &&(==(key; "w"); != (direction; "down")); = (direction; "up");
      &&(==(key; "s"); != (direction; "up")); = (direction; "down");
      &&(==(key; "a"); != (direction; "left")); = (direction; "right");
      &&(==(key; "d"); != (direction; "right")); = (direction; "left");
    )
))
