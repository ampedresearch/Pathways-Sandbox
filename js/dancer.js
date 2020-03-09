class Dancer {
	constructor(){
		//position
		this.pos = createVector(width/2,height/2);
		this.direction;
		this.state;

		//facings
		this.facingType;
		this.facingLength = 25;
		this.facing = createVector(0,1);

		// slider value
		this.slider = 5; //default to 5

		//display
		this.size = 25;
		this.fill;

		//circular vars
		this.radius = this.slider * 10;
		this.angle = 0;
		this.speed = 0.05;
		this.center = createVector(width/2, height/2);

		// linear vars
		this.velocity = createVector(1,0);
	}


	update(){
		if(this.state == null){
			textSize(24);
			text('select a pathway!', this.pos.x + this.size, this.pos.y);
		} else if (this.state == "CIRCULAR"){
			this.radius = this.slider * 18;
			this.updateCircular();
		} else if (this.state == "LINEAR"){
			stroke(255);

			// update starting position as slider changes
			this.startPos = createVector(width/2 - this.slider * 20,height/2);
			this.endPos = createVector(width/2 + this.slider * 20,height/2);
			strokeWeight(5);
			line(this.startPos.x,this.startPos.y,this.endPos.x,this.endPos.y);
			fill(0);
			noStroke();
			ellipse(this.startPos.x,this.startPos.y, 15, 15);
			ellipse(this.endPos.x,this.endPos.y, 15, 15);

			this.updateLinear();
		}


	}

	updateState(state){
		this.state = state;

		//create initial starting position
		this.startPos = createVector(width/2 - this.slider * 20,height/2);
			
		//set pos to beginning of line
		this.pos.x = this.startPos.x;
		this.pos.y = this.startPos.y;
	}

	updateSlider(value){
		this.slider = value;
	}

	updateFacing(state){
		this.facingType = state;
	}


	// Movement functions

	updateCircular(){
		this.pos.x = this.center.x + this.radius * cos(this.angle);
		this.pos.y = this.center.y + this.radius * sin(this.angle);

		// calculate facings
		switch(this.facingType) {
			case 'INWARD':
				this.facing.x = -this.facingLength * cos(this.angle);
				this.facing.y = -this.facingLength * sin(this.angle); 
				break;
			case 'OUTWARD':
				this.facing.x = this.facingLength * cos(this.angle);
				this.facing.y = this.facingLength * sin(this.angle); 
				break;
			case 'FORWARD':
				this.facing.x = -this.facingLength * sin(this.angle);
				this.facing.y = this.facingLength * cos(this.angle);
				break;
			case 'BACKWARD':
				this.facing.x = this.facingLength * sin(this.angle);
				this.facing.y = -this.facingLength * cos(this.angle);
				break;
		}

		// move angle
		this.angle = this.angle + this.speed;

		// draw path below dancer
		noFill();
		stroke(255);
		strokeWeight(2);
		ellipse(this.center.x, this.center.y, this.radius * 2);

		// draw facing here
		strokeWeight(10);
		stroke(0);
		line(this.pos.x, this.pos.y,this.pos.x+this.facing.x,this.pos.y+this.facing.y)
	}

	updateLinear(){

		// calculate velocity as vector between start / end positions
		this.pos.x += this.velocity.x; // 1
		this.pos.y += this.velocity.y; // 0



		// switch directions
		if(this.pos.x > this.endPos.x){ //if at end
			this.velocity.x = -this.velocity.x;
			// should change this to either change direction OR set velocity to 0?
		} else if (this.pos.x < this.startPos.x){
			this.velocity.x = -this.velocity.x;
		}

		// calculate facing
		this.angle = Math.PI/2 * this.velocity.x;

		switch(this.facingType) {
			case 'INWARD':
				this.facing.x = 0;
				this.facing.y = -this.facingLength;
				break;
			case 'OUTWARD':
				this.facing.x = 0;
				this.facing.y = this.facingLength; 
				break;
			case 'FORWARD':
				this.facing.x = this.facingLength * sin(this.angle);
				this.facing.y = this.facingLength * cos(this.angle);
				break;
			case 'BACKWARD':
				this.facing.x = -this.facingLength * sin(this.angle);
				this.facing.y = -this.facingLength * cos(this.angle);
				break;
			default:
				this.facing.x = -this.facingLength * sin(this.angle);
				this.facing.y = this.facingLength * cos(this.angle);
		}

		// draw facing here
		strokeWeight(10);
		stroke(0);
		line(this.pos.x, this.pos.y,this.pos.x+this.facing.x,this.pos.y+this.facing.y)
	}

	show(){
		noStroke();
		fill(255);
		ellipse(this.pos.x,this.pos.y, this.size, this.size);
	}

}
