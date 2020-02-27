class Dancer {
	constructor(){
		//position
		this.pos = createVector(50,50);
		this.direction;
		this.state;

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
		this.startPos = createVector(100,100);
		this.endPos = createVector(700,100);
	}


	update(){
		if(this.state == null){
			textSize(24);
			text('select a pathway!', this.pos.x + this.size, this.pos.y);
		} else if (this.state == "CIRCULAR"){
			this.radius = this.slider * 18;
			this.updateCircular();
		} else if (this.state == "LINEAR"){
			this.updateLinear();
		}


	}

	updateState(state){
		this.state = state;

		this.pos.x = this.startPos.x;
		this.pos.y = this.startPos.y;
	}

	updateSlider(value){
		this.slider = value;
	}

	updateCircular(){
		this.pos.x = this.center.x + this.radius * cos(this.angle);
		this.pos.y = this.center.y + this.radius * sin(this.angle);

		this.angle = this.angle + this.speed;

		// draw path below dancer 
		noFill();
		stroke(255);
		ellipse(this.center.x, this.center.y, this.radius * 2);
	}

	updateLinear(){
		// this shouldn't be here!
		// neeed to fix direction if statements 
		this.velocity.x = this.slider /2;

		// draw pathway start + end points
		stroke(255);
		line(this.startPos.x,this.startPos.y,this.endPos.x,this.endPos.y);
		fill(0);
		noStroke();
		ellipse(this.startPos.x,this.startPos.y, 15, 15);
		ellipse(this.endPos.x,this.endPos.y, 15, 15);

		if(this.pos.x >= this.endPos.x){ //if at end
			this.velocity.x = -this.slider /2;
			// should change this to either change direction OR set velocity to 0?
		} else if (this.pos.x <= this.startPos.x){
			this.velocity.x = this.slider /2;
		}

		// if end pos is X vector distance for start pos
		//end movement



		// calculate velocity as vector between start / end positions
		// temp hard-coded values of velocity
		this.pos.x += this.velocity.x; // 1
		this.pos.y += this.velocity.y; // 0


	}

	show(){
		noStroke();
		fill(255);
		ellipse(this.pos.x,this.pos.y, this.size, this.size);
	}

}