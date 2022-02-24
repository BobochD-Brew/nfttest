let size = 1000
let roots;
let colors;
let pos = 1;
let numberCircles = 100;
let circleSize = 4;
let bx;
let by;
let startX;
let startY;
let xOffset = 0.0;
let yOffset = 0.0;
let h;
let img;
let updating = false;
let sizeee;
let deep = 10;
function mult(x,y){
  x2 = createVector(x.x*y.x-x.y*y.y,x.y*y.x+y.y*x.x)
  return(x2)
}
function power(x,n){
  xsave = createVector(x.x,x.y)
  for(let i = 0 ;i < n-1;i++){
   xsave = mult(x,xsave)
  }
  return xsave
}
function divid(x,y){
  if(y.mag() == 0) return(createVector(0,0))
  return(createVector(
  (x.x*y.x+x.y*y.y)/(y.x*y.x+y.y*y.y),(x.y*y.x-x.x*y.y)/(y.x*y.x+y.y*y.y)
  ))
}
function f(z) {
  let vec = createVector(1, 0);
  for (let i = 0; i < roots.length; i++) {
    let factor = createVector((z.x-roots[i].x),(z.y-roots[i].y));
    vec = mult(vec,factor);
  }
  return vec;
}

function df(z) {
  let vec = createVector(0, 0);
  for (let j = 0; j < roots.length; j++) {
    let factor = createVector(1, 0);
    for (let i = 0; i < roots.length; i++) {
      if (i != j) {
        factor = mult(factor,createVector((z.x-roots[i].x),(z.y-roots[i].y)));
      }
    }
    vec = createVector((vec.x+factor.x),(vec.y+factor.y));
  }
  return vec;
}
function mouseWheel(event) {
  updating = true;
if(event.delta>0){
   pos = pos*1.15;
}else{
  pos = pos*0.90;
}
update(50)
 

}
function ff(x){
  x2 = x.copy()
  let i = 0
  while(i<deep){
    x3 = x2.copy()
  dfx = df(x2)
  x2 = divid(f(x),dfx)
    x2 = createVector(x3.x-x2.x,x3.y-x2.y)
  x2.x = -x2.x
  x2.y = -x2.y
    i++
  }
  return(x2)
}
function mousePressed() {
  updating = true;
  startX = mouseX;
  startY = mouseY;
}
function mouseDragged() {
  updating = true;
    xOffset += mouseX - startX;
    yOffset -= mouseY - startY;
  startX = mouseX;
  startY = mouseY;
  update(50)
}
function mouseReleased() {
  update(50)
}
function draw(){
  if(!updating && sizeee <size) update(sizeee + 10);
}
function closest(x){
  
  x3 = createVector(roots[0].x-x.x,roots[0].y-x.y)
  let d = x3.mag()
  let index = 0
  for(let i = 0;i<roots.length;i++){
    x3 = createVector(roots[i].x-x.x,roots[i].y-x.y)
    if(x3.mag() < d){
      index = i;
      d = x3.mag()
    }
  }
  return(index);
}
function setup(){
  roots = [
  createVector(-100,0),
  createVector(100*cos(TWO_PI/6),100*sin(TWO_PI/6)),
  createVector(100*cos(TWO_PI/6),-100*sin(TWO_PI/6)),
            ]
  colors = [
  color('green'),
  color('red'),
  color('blue'),
  color('yellow'),
  color('cyan')
  ]

  createCanvas(size,size);
  background(255)
  strokeWeight(0)
  
  update(50)
  
}

function update(sizee){
  sizeee = sizee;
  updating = true;
  background(255)
  img = createImage(sizee, sizee);
  h = (size)/img.width;
  img.loadPixels();
  for(let i = 0;i<img.width;i++){
    for(let j = 0;j<img.height;j++){
      img.set(i,j,colors[closest(ff(createVector(
        (i*h-size/2 -xOffset)*pos,
        (-j*h+size/2 -yOffset)*pos)))])
    } 
  }
  img.updatePixels();
  image(img, 0, 0,size,size);
  updating = false;
}