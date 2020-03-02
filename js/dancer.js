class Dancer {
	constructor(){
		//position
		this.pos = createVector(width/2,height/2);
		this.direction;
		this.state;
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
			this.startPos = createVector(width/2 - this.slider * 20,height/2);
			this.endPos = createVector(width/2 + this.slider * 20,height/2);
			line(this.startPos.x,this.startPos.y,this.endPos.x,this.endPos.y);
			fill(0);
			noStroke();
			ellipse(this.startPos.x,this.startPos.y, 15, 15);
			ellipse(this.endPos.x,this.endPos.y, 15, 15);
			// this.pos.x = this.startPos.x;
			// this.pos.y = this.startPos.y;
			//

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
		// this.facing.x = -50 * cos(this.angle);
		// this.facing.y = -50 * sin(this.angle);
		// this.facing.x = -50 * cos(this.angle);
		// this.facing.y = -50 * sin(this.angle);
		// backwards
		// this.facing.x = 50 * sin(this.angle);
		// this.facing.y = -50 * cos(this.angle);
		// forwards
		this.facing.x = -50 * sin(this.angle);
		this.facing.y = 50 * cos(this.angle);


		this.angle = this.angle + this.speed;

		// draw path below dancer
		noFill();
		stroke(255);
		ellipse(this.center.x, this.center.y, this.radius * 2);
		line(this.pos.x, this.pos.y,this.pos.x+this.facing.x,this.pos.y+this.facing.y)
	}

	updateLinear(){


		// calculate velocity as vector between start / end positions
		// temp hard-coded values of velocity
		this.pos.x += this.velocity.x; // 1
		this.pos.y += this.velocity.y; // 0



		//
		if(this.pos.x > this.endPos.x){ //if at end
			this.velocity.x = -this.velocity.x;
			// should change this to either change direction OR set velocity to 0?
		} else if (this.pos.x < this.startPos.x){
			this.velocity.x = -this.velocity.x;
		}

		// if end pos is X vector distance for start pos
		//end movement



	}

	show(){
		noStroke();
		fill(255);
		ellipse(this.pos.x,this.pos.y, this.size, this.size);
	}

}
