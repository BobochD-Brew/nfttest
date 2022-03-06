 p5.disableFriendlyErrors = true;
var backgroundLayer;
var waterLayer;
var vegetalLayer;
var creatureLayer;
var ui;
var seed;
var vegetals = [];
var creatures = [];
var waterSpots = [];

const noiseScale = 250;
const vegetalsNum = 200;
const creatureNum = 30;
const qualitySize = 5;

var selected = null;

var waterColor;
var waterColor2;
var groundColor;
var groundColor2;
var limit;
var uplimit;
 let width;
 let height;
let bofset;
var drawing = false;
var startFrame = 200;
function generateGroundPos(){
  let x = width*(1/20)+ width*(19/20)*random(0,1);
  let y = height*(1/20)+ height*(19/20)*random(0,1);
  while (superNoise(x / noiseScale, y / noiseScale, 0) <= limit) {
      x = width*(1/20)+ width*(19/20)*random(0,1);
      y = height*(1/20)+ height*(19/20)*random(0,1);
  }
  return createVector(x,y)
}

function generateSeed() {
    limit = random(0.25, 0.45)
    uplimit = random(0.5, 1)
	let L = [
        color(random(20, 50), random(20, 50), random(150, 230), 250),
        color(random(70, 120), random(210, 250), random(190, 240))
    ]
    waterColor = L[int(random(0, 2))];
	L = [
        color(random(20, 50), random(20, 50), random(150, 230), 250),
        color(random(10, 40), random(10, 40), random(150, 170))
    ]
    waterColor2 = L[int(random(0, 2))];//lerpColor(waterColor, color(0), 0.5)
	bofset = random(0,0.5);
    L = [
        color(random(200, 250), random(200, 250), random(50, 100)),
        color(random(70, 120), random(200, 250), random(70, 120)),
		color(random(190, 240), random(100, 150), random(40, 70))
    ]
    groundColor = L[int(random(0, 3))]
    L = [
        color(random(200, 250), random(200, 250), random(50, 100)),
        color(random(70, 120), random(200, 250), random(70, 120)),
		color(random(190, 240), random(100, 150), random(40, 70))
    ]
    groundColor2 = L[int(random(0, 3))]
    for (let i = 0; i < vegetalsNum; i++) {
        let cords = generateGroundPos()
        vegetals[i] = new Vegetal(cords.x, cords.y, random(5, 15))
    }

    for (let i = 0; i < creatureNum; i++) {
        let cords = generateGroundPos()
        creatures[i] = new Creature(int(cords.x), int(cords.y), random(10,15))
    }

}

function setup() {
    let params = getURLParams();
    seed = params.id;
	startFrame = params.start;
	width = 600;
	height = 600;
    randomSeed(seed);
    noiseSeed(seed);
    generateSeed();

    createCanvas(windowWidth, windowHeight);
    backgroundLayer = createGraphics(width, height);
		width = 600;
	height = 600;
    waterLayer = createGraphics(width, height);
		width = 600;
	height = 600;
    vegetalLayer = createGraphics(width, height);
		width = 600;
	height = 600;
    creatureLayer = createGraphics(width, height);
	width = 600;
	height = 600;
    ui = createGraphics(width, windowHeight);
    	width = 600;
	height = 600;
  
    setLayers()
	drawing = false;
	for(let i = 0; i < startFrame; i++){
		frameCount++;
		draw();
	}
	drawing = true;
	
}
function superNoise(x,y,z){
	x *= 600/width
	y *= 600/height
	a = noise(x, y, z)
	b = noise(x*7, y*7, z)
	c = noise(x*4, y*4, z)*0.1 - 0.1
	return(Math.min(a,b+bofset)+c)
}
function setLayers() {
    backgroundLayer.background(groundColor);
    backgroundLayer.strokeWeight(0);
    waterLayer.strokeWeight(0);
    creatureLayer.strokeWeight(0.5);
	creatureLayer.stroke(0);
    vegetalLayer.strokeWeight(0);
    ui.textSize(10)
    for (let i = 0; i < width; i+=1) {
        for (let j = 0; j < height; j+=1) {
            if (superNoise(i / noiseScale, j / noiseScale, 0) <= limit) {
				waterLayer.fill(lerpColor(waterColor2,waterColor,noise(i / noiseScale, j / noiseScale, 0)/limit));//*(3/limit)-(limit * 2 / 3)));
                
                waterLayer.circle(i, j, 1)
                if(i % qualitySize == 0 && j % qualitySize == 0) waterSpots.push(createVector(i, j))
            } else if (superNoise(i / noiseScale, j / noiseScale, 0) <= limit + 0.01) {
                backgroundLayer.fill(lerpColor(groundColor, waterColor, 0.5));
                backgroundLayer.circle(i, j, 1)
            }else if (superNoise(i / noiseScale, j / noiseScale, 0) <=  limit + (1 -limit)/3 ) {
                backgroundLayer.fill(groundColor);
                backgroundLayer.circle(i, j, 1)
            }else if (superNoise(i / noiseScale, j / noiseScale, 0) <=  limit + (1 -limit)*2/3 ) {
                backgroundLayer.fill(lerpColor(groundColor,groundColor2,0.5));
                backgroundLayer.circle(i, j, 1)
            } else {
                backgroundLayer.fill(groundColor2);
                backgroundLayer.circle(i, j, 1)
            }
        }
    }
}

function draw() {
	updateVegetal();
	updateCreatures();
	if(drawing){
		//drawUI()
		image(backgroundLayer, 0, 0,windowWidth,windowHeight);
		image(waterLayer, 0, 0,windowWidth,windowHeight);
		image(vegetalLayer, 0, 0,windowWidth,windowHeight);
		image(creatureLayer, 0, 0,windowWidth,windowHeight); 
		//image(ui, 0, 0,windowWidth,windowHeight);
	}
    
}
function twoDec(x){
	return(floor(x*100)/100)
}
function drawUI() {
    ui.clear()
    if (selected != null && selected != undefined && selected != NaN && selected.health > 0 && selected.size > 0) {
		ui.fill(color(250,40));
		let x,y;
		let sx = 100;
		let sy = 70+50+10+40
		if(selected.position.x>=width/2 && selected.position.y>= height/2){
			x = selected.position.x - 10 - sx;
			y = selected.position.y - 10 - sy;
		}else if(selected.position.x>=width/2 && selected.position.y<= height/2){
			x = selected.position.x - 10 - sx;
			y = selected.position.y + 10;
		}else if(selected.position.x<=width/2 && selected.position.y>= height/2){
			x = selected.position.x + 10;
			y = selected.position.y - 10 - sy;
		}else{
			x = selected.position.x + 10;
			y = selected.position.y + 10;
		}
		
		ui.rect(x,y,sx,sy);
		ui.fill(color(0));
        ui.text("Size: " + int(selected.size) + "", x+5, y+13);
        ui.text("Health: " + twoDec(selected.health) + "", x+5, y+23);
		ui.text("Food: " + int(selected.food) + "/100", x+5, y+33);
        ui.text("Thirst: " + int(selected.thirst) + "/100", x+5, y+43);
        ui.text("Cloning: " + int(selected.sex) + "/100", x+5, y+53);
        ui.text("FPS: " + int(frameRate()), x+5, y+63);
		let cx,cy;
		cx = x + 50;
		cy = y + 70 + 50;
		let r = 40;
		ui.fill(color(0,0));
        ui.beginShape();
        ui.vertex(cx+Math.cos(TWO_PI/3 - PI/6)*r,cy-Math.sin(TWO_PI/3 - PI/6)*r);
        ui.vertex(cx+Math.cos(TWO_PI*2/3 - PI/6)*r,cy-Math.sin(TWO_PI*2/3 - PI/6)*r);
        ui.vertex(cx+Math.cos(TWO_PI*3/3 - PI/6)*r,cy-Math.sin(TWO_PI*3/3 - PI/6)*r);
        ui.endShape(CLOSE);
		ui.circle(cx,cy,r*2);
        ui.beginShape();
        ui.vertex(cx+Math.cos(TWO_PI/3 - PI/6)*r*(red(selected.color)/250),cy-Math.sin(TWO_PI/3 - PI/6)*r*(red(selected.color)/250));
        ui.vertex(cx+Math.cos(TWO_PI*2/3 - PI/6)*r*(green(selected.color)/250),cy-Math.sin(TWO_PI*2/3 - PI/6)*r*(green(selected.color)/250));
        ui.vertex(cx+Math.cos(TWO_PI*3/3 - PI/6)*r*(blue(selected.color)/250),cy-Math.sin(TWO_PI*3/3 - PI/6)*r*(blue(selected.color)/250));
        ui.endShape(CLOSE);
		ui.stroke(color('red'))
		ui.fill(color('red'))
		ui.line(cx,cy,cx+Math.cos(TWO_PI/3 - PI/6)*r,cy-Math.sin(TWO_PI/3 - PI/6)*r);
		ui.stroke(color('green'))
		ui.fill(color('green'))
		ui.line(cx,cy,cx+Math.cos(TWO_PI*2/3 - PI/6)*r,cy-Math.sin(TWO_PI*2/3 - PI/6)*r);
		ui.stroke(color('blue'))
		ui.fill(color('blue'))
		ui.line(cx,cy,cx+Math.cos(TWO_PI*3/3 - PI/6)*r,cy-Math.sin(TWO_PI*3/3 - PI/6)*r);
		ui.stroke(color(0));
		ui.fill(color(0));
		ui.circle(cx,cy,3);
		ui.fill(color(0,0))
		ui.stroke(color('red'))
		ui.circle(selected.position.x,selected.position.y,selected.size);
		ui.stroke(color(0))
    }
}

function mousePressed() {
    for (let i = 0; i < creatures.length; i++) {
        if (creatures[i].isClicking(mouseX, mouseY)) {
            selected = creatures[i];
            return;
        }
    }
    for (let i = 0; i < vegetals.length; i++) {
        if (vegetals[i].isClicking(mouseX, mouseY)) {
            selected = vegetals[i];
            return;
        }
    }
    selected = null;
}

function updateCreatures() {
    creatureLayer.clear()
    for (let i = 0; i < creatures.length; i++) {
        creatures[i].update(creatures, vegetals, waterSpots, waterLayer)
        if (creatures[i].health <= 0) {
            creatures.splice(i, 1);
        } else if(drawing){
            creatures[i].display(creatureLayer)
        }
    }
}

function updateVegetal() {
    vegetalLayer.clear()
    for (let i = 0; i < vegetals.length; i++) {
        vegetals[i].update(vegetals,creatures,waterLayer)
		if(vegetals[i] == null) continue;
        if (vegetals[i].size <= 0) {
            vegetals.splice(i, 1);
        } else if(drawing){
            vegetals[i].display(vegetalLayer)
        }
    }
}
