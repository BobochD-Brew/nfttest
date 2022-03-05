class Vegetal {
    constructor(x, y, size) {
        this.position = createVector(x, y);
        this.size = size;
        this.health = 1;
        this.age = 0;
        this.attraction = random(1, 2);
        this.range = 100;
        this.addition = 0.1;
        this.detectsize = 10;
        this.color = color(random(40, 70), random(130, 200), random(40, 70));
        this.degradation = 0.01;
        this.maxsize = random(25, 45);
		this.daron = null;
    }
    isClicking(x, y) {
        return (createVector(x, y).dist(this.position) <= this.size)
    }
    display(canva) {
		this.color.setAlpha(180)
        canva.fill(this.color)
        let size2 = 1 + this.maxsize - this.maxsize * exp(-this.size / 65)
        canva.circle(this.position.x, this.position.y, this.size <= 0 ? this.size : size2);
    }
    update(vegetals,creatures,water) {
        this.age += 0.01
        let maxS = 0;
        this.size = this.size <= 0 ? 0 : (this.size - this.degradation);
        if (this.age < 2) {this.size += 0.1;return;}
        let maxV = null;
        let distst = 0;
        let c = 0
		if((this.daron == null || this.daron == NaN || this.daron == undefined) && frameCount % 10 == 0){
			let random1 = random(0,1)
			for (let i = 0; i < vegetals.length; i++) {
				let vegetal = vegetals[i];
				distst = this.position.dist(vegetal.position);
				if(distst > this.range) continue;
				
				if(distst < ((1 + this.maxsize - this.maxsize * exp(-this.size / 25))) && this.size/2 > vegetal.size && distst != 0){
				  this.size = ((this.size + vegetal.size/3) > this.maxsize ? this.maxsize : (this.size + vegetal.size/3));
				  vegetal.size = -1;
				  continue;
				}
				if (distst < this.range / 2.4 && vegetal.size >= this.size && distst != 0) c++;
				
				if (maxS <= vegetal.size && (random1 > 0.2 || vegetal.size < vegetal.maxsize)) {
					maxS = vegetal.size;
					maxV = vegetal;
				}
			}
			if( maxV == null  || maxV.position.dist(this.position) == 0){
				if(this.size > 5 && random(0,1) < 0.05){
					let x = this.position.x + random(-this.range, this.range);
					let y = this.position.y + random(-this.range, this.range);
					vegetals.push(new Vegetal(x, y, random(2, 4)))
					if(blue(water.get(x, y)) > 100) vegetals[vegetals.length -1].color = color(random(40, 70), random(40, 70),random(130, 200));
					vegetals[vegetals.length -1].daron = this;
					if(random(0, 1) < 0.005){
						creatures.push(new Creature(x, y, random(5,10)))
						let r,g,b;
						r = random(0,250);
						g = random(0,(250-r*(2/3)))
						let temp = max(r,g)
						b = random(250-temp,(250-temp*(2/3)))
						creatures[creatures.length - 1].color = color(r, g, b);
						if(random(0, 1) < 0.05) creatures[creatures.length - 1].size = random(5,25)
						creatures[creatures.length - 1].sizecount = int(random(3,8));
					}
				}
			}else{
				this.daron = maxV;
			}
		}
		if(!(this.daron == null || this.daron == NaN || this.daron == undefined)){
			distst = this.position.dist(this.daron.position);
			if (this.daron.size < this.daron.maxsize) this.daron.size += this.addition / (distst < 1 ? 1 : distst);
			if(random(0,1) < ((blue(water.get(this.position.x, this.position.y)) > 100) ? (vegetals.length < 200 ? 0.01 : 0.005) : 0.0005)){
				let x = this.position.x + random(-this.range, this.range);
				let y = this.position.y + random(-this.range, this.range);
				vegetals.push(new Vegetal(x, y, random(2, 4)))
				if(blue(water.get(x, y)) > 100) vegetals[vegetals.length -1].color = color(random(40, 70), random(40, 70),random(130, 200));
				vegetals[vegetals.length -1].daron = this;
				if(random(0, 1) < 0.0001){
					creatures.push(new Creature(x, y, random(5,10)))
					let r,g,b;
					r = random(0,250);
					g = random(0,(250-r*(2/3)))
					let temp = max(r,g)
					b = random(0,(250-temp*(2/3)))
					creatures[creatures.length - 1].color = color(r, g, b);
					if(random(0, 1) < 0.05) creatures[creatures.length - 1].size = random(5,25)
					creatures[creatures.length - 1].sizecount = int(random(3,8));
				}
			}
			//if (c > (this.size >= 10 ? 5 : 5)) this.size -= 0.1;
		}
    }
    
}
