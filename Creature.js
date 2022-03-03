class Creature {
    constructor(x, y, size) {
        this.position = createVector(x, y);
        this.size = size;
        this.health = 10;
        this.age = 0;
		this.sizecount = 3;
        this.range = random(100,170);
        this.addition = 1;
        this.detectsize = 10;
        let L = [
            color(random(150, 250), random(40, 70), random(40, 70)),
            color(random(40,70),random(40,70),random(150,200)),
			color(random(40,70),random(150,200),random(40,70))
        ]
        this.color = L[2]
        this.attraction = random(1, 2);
        this.sex = 40;
        this.food = 10;
        this.thirst = 10;
        this.speed = 0.4
        this.maturity = 5;
        this.egg = true;
        this.prevpos = createVector(x+random(-5, 5), y+random(-5, 5));
    }
    isClicking(x, y) {
        return (createVector(x, y).dist(this.position) <= this.size)
    }

    display(canva) {
        canva.fill(this.egg ? color(0) : this.color)
        let theta = createVector(this.position.x-this.prevpos.x,this.position.y-this.prevpos.y).heading() + PI / 2;
        let size = this.egg ? this.size / 6 : this.size / 3;
        canva.push();
        canva.translate(this.position.x, this.position.y);
        canva.rotate(theta);
        
		canva.beginShape();
		for(let i = 0; i < this.sizecount;i++){
			let angle = TWO_PI*(i+1)/this.sizecount - (TWO_PI/this.sizecount-PI/2);
			canva.vertex(cos(angle)*size,-sin(angle)*size);
		}
        canva.endShape(CLOSE);
        canva.pop();
    }
    update(creatures, vegetals, waterspots, water) {
        
        this.age += 0.01
        if (this.age > 2) this.egg = false; else return;
        
        this.health -= 0.001;
        if (this.age > this.maturity) this.sex = ((this.sex - 0.02 < 0) ? 0 : this.sex - 0.02);
        this.food = ((this.food - 0.05 < 0) ? 0 : (this.food - 0.05));
        this.thirst = ((this.thirst - 0.05 < 0) ? 0 : this.thirst - 0.05);
        if (this.sex * this.thirst * this.food == 0) this.health -= 0.01;
		
        let vectorList = []  
        let sufocation = 0;
        for (let i = 0; i < creatures.length; i++) {
            let creature = creatures[i];
            if(creature.position == null) continue;
            if(creature.health <= 0) continue;
			if(creature == null) continue;
            let distance = this.position.dist(creature.position);
            if(distance == 0 || distance > this.range) continue;
            if(distance > 2 * this.size) continue;
            sufocation++;
            if(this.age <= this.maturity) continue;
            let redDiff = abs(red(creature.color) - red(this.color))
            let greenDiff = abs(green(creature.color) - green(this.color))
            let blueDiff = abs(blue(creature.color) - blue(this.color))
            let colorDiff = (redDiff + greenDiff + blueDiff) / 3
            let canReproduce = this.age >= this.maturity && creature.age >= creature.maturity && colorDiff < 50;
            let vec = createVector(creature.position.x - this.position.x, creature.position.y - this.position.y)
            if(canReproduce){
				
                if(min(this.food,this.sex,this.food) > 20 ||(this.sex <= this.food && this.sex <= this.thirst)) vectorList.push(vec.normalize().mult(creature.attraction * (100 - this.sex) / (1 + distance)));
                if (distance <= this.size) {
                    this.maturity = this.age + 2;
                    creature.maturity = creature.maturity + 2;
                    this.sex = 100;
                    creature.sex = 100;
                    this.health -= 1;
                    for (let j = 0; j < min(this.health, creature.health) / 4; j++) {
                        creatures.push(new Creature(this.position.x, this.position.y, (this.size+creature.size)/2))
                        creatures[creatures.length - 1].color = color((red(creatures[i].color) + red(this.color)) / 2, (green(creature.color) + green(this.color)) / 2, (blue(creature.color) + blue(this.color)) / 2)
                        creatures[creatures.length - 1].sizecount = int((this.sizecount + creature.sizecount)/2);
						if (random(0, 1) < 0.09){
							let r,g,b;
							r = random(0,250);
							g = random(0,(250-r*(2/3)))
							let temp = max(r,g)
							b = random(0,(250-temp*(2/3)))
							creatures[creatures.length - 1].color = color(r, g, b);
							creatures[creatures.length - 1].sizecount = int(random(3,8));
							if(random(0, 1) < 0.05) creatures[creatures.length - 1].size = random(5,25)
							
						}
					}
                }
            }else if (redDiff > 70 && red(this.color) > 140) {
				if(creature.food == null || creature.food == NaN) continue;
                if(min(this.food,this.sex,this.food) > 20 ||( this.food <= this.sex && this.food <= this.thirst)) vectorList.push(vec.normalize().mult((creature.food / 100) * (red(this.color)/green(this.color))*(100-this.food)/(1 + distance)));
                if (distance <= this.size) {
                    this.food = (this.food + creature.food) > 100 ? 100 : (this.food + creature.food);
                    creature.health = 0;
                    for (let j = 0; j < int(random(0, 1)*creature.food / 20); j++) {
                        let x = this.position.x + random(-20, 20);
                        let y = this.position.y + random(-20, 20);
                        vegetals.push(new Vegetal(x, y, random(2, 4)))
						if(blue(water.get(x, y)) > 100) vegetals[vegetals.length -1].color = color(random(40, 70), random(40, 70),random(130, 200));
                    }
                }
            }
        }
        if (sufocation >= 5) this.health -= 0.01 * sufocation;
        for (let i = 0; i < vegetals.length; i++) {
            let vegetal = vegetals[i];
			if(vegetal.age < 3) continue;
            if(vegetal.position == null) continue;
			if(vegetal == null || vegetal == NaN || vegetal.size <= 0 || vegetal.size == null || vegetal.size == NaN) continue;
            let distance = this.position.dist(vegetal.position);
            if(distance == 0 || distance == null || distance > this.range) continue;
            let vec = createVector(vegetals[i].position.x - this.position.x, vegetal.position.y - this.position.y)
	    let a = (blue(this.color) < 100 && blue(vegetal.color) >= 100);
	    let b = a || ((green(this.color) < 100 || red(this.color) < 150 ) && green(vegetal.color) >= 100);
	
            if(!b && (min(this.food,this.sex,this.food) > 20 || (this.food <= this.sex && this.food <= this.thirst))) vectorList.push(vec.normalize().mult(vegetal.attraction*random(1, 1.2)*green(this.color)/red(this.color) * (100 - this.food) / (1 + distance)));
            if (distance <= this.size) {
                if (vegetal.size > 7)
                for (let j = 0; j < int(random(0, vegetal.size / 2)); j++) {
                    let x = this.position.x + random(-30, 30);
                    let y = this.position.y + random(-30, 30);
                    vegetals.push(new Vegetal(x, y, random(2, 4)))
					if(blue(water.get(x, y)) > 100) vegetals[vegetals.length -1].color = color(random(40, 70), random(40, 70),random(130, 200));
                }
                if(vegetal.size != NaN && vegetal.size != null && vegetal.size != undefined && vegetal.size > 0) this.food += (green(this.color) > 130 && blue(this.color) < 100) ? vegetal.size/2 : vegetal.size/4;
                this.age += 0.2;
                if (this.food>100) this.food = 100;
                //vegetals.splice(i, 1);
				vegetal.size = -0.05;
                setTimeout(() => {
                    vegetals.push(new Vegetal(this.position.x, this.position.y, random(1, 3)))
					if(blue(water.get(this.position.x, this.position.y)) > 100) vegetals[vegetals.length -1].color = color(random(40, 70), random(40, 70),random(130, 200));
                }, random(500, 1500));
            }
        }
		if(min(this.food,this.sex,this.food) > 20 ||(this.thirst <= this.sex && this.thirst <= this.food))
			for (let i = 0; i < waterspots.length; i++) {
			  if(waterspots[i] == null ) continue;
			  let distance = this.position.dist(waterspots[i])
			  if(distance == 0 || distance > this.range) continue;
			  let vec = createVector(waterspots[i].x - this.position.x, waterspots[i].y - this.position.y)
			  vectorList.push(vec.normalize().mult((100 - this.thirst) / (1+distance)));
			  if (distance <= this.size) {
				  this.thirst = ((this.thirst + 0.5) > 100 ? 100 : this.thirst + 0.5);
			  }
			}
		let maxL = createVector(0,0);
        maxL = createVector(this.position.x-this.prevpos.x,this.position.y-this.prevpos.y)
		if (this.position != this.prevpos) this.prevpos = createVector(this.position.x,this.position.y);
		maxL = maxL.normalize().mult(0.02)
        vectorList.forEach((x) => {
            if (x.mag() > maxL.mag()) maxL = x.copy();
        })
        maxL = maxL.normalize().mult(this.speed);
        this.position = this.position.add(maxL);
        let change = int(green(this.color)) % 2 == 0
		let count = 0;
        while (blue(water.get(this.position.x, this.position.y)) > 100 && blue(this.color) < 100 && count < 50) {
            this.position = this.position.sub(maxL);
            let angle = createVector(1, 0).angleBetween(maxL)
            angle += change? 0.2 : -0.2;
            maxL = createVector(cos(angle)*this.speed, sin(angle)*this.speed);
            this.position = this.position.add(maxL);
			count++;
        }
		if(count == 50) this.health -= 0.1;
		count = 0;
        while (blue(water.get(this.position.x, this.position.y)) < 100 && (green(this.color) < 100 || red(this.color) < 150) && count < 50) {
            this.position = this.position.sub(maxL);
            let angle = createVector(1, 0).angleBetween(maxL)
            angle += change? 0.2 : -0.2;
            maxL = createVector(cos(angle)*this.speed, sin(angle)*this.speed);
            this.position = this.position.add(maxL);
			count++;
        }
		if(count == 50) this.health -= 0.1;
		count = 0;
        while (((this.position.x < 0) ||(this.position.x > width) || (this.position.y < 0) || (this.position.y > height) )&& count < 50) {
            this.position = this.position.sub(maxL);
            let angle = createVector(1, 0).angleBetween(maxL)
            angle += change? 0.2 : -0.2;
            maxL = createVector(cos(angle)*this.speed, sin(angle)*this.speed);
            this.position = this.position.add(maxL);
			count++;
        }
		if(count == 50) this.health -= 0.1;
    }

}
