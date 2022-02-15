
setup (-> (
  |> (
    createWebGlCanvas();
))); 
  
draw (-> (
  |> (
  background (200);
  rotateX (* (frameCount (); 0.01));
  rotateY (* (frameCount (); 0.01));
  box (50);
)));

