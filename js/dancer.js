class Dancer {
	constructor(){
		//position
		this.pos = createVector(width/2,height/2);
		this.arrowhead = createVector(0,1);
		this.pathway;
		this.facing = "FORWARD";
		this.arrowlength = 50;

		//display
		this.size = 25;
		this.fill;

		//circular vars
		this.radius = 50;
		this.angle = 0;
		this.speed = 1;
		this.center = createVector(width/2, height/2);

		// linear vars
		this.lineDirection = 0; // angle with horizontal
		this.velocity = createVector(1,0);
		this.lineStartPos;
		this.lineEndPos;

	}


	update(){
		if(this.pathway == null){
			textSize(24);
			text('select a pathway!', this.pos.x + this.size, this.pos.y);
		} else if (this.pathway == "CIRCULAR"){
			// this.radius = this.slider * 18;
			// this.pos.x = this.center.x - this.radius;
			// this.pos.y = this.center.y;
			this.updateCircular();
		} else if (this.pathway == "LINEAR"){
			stroke(255);
			this.lineStartPos = createVector(parseFloat(width/2) - parseFloat(this.radius),height/2);
			this.lineEndPos = createVector(parseFloat(width/2) + parseFloat(this.radius), height/2);
			line(this.lineStartPos.x,this.lineStartPos.y,this.lineEndPos.x,this.lineEndPos.y);
			fill(0);
			noStroke();
			ellipse(this.lineStartPos.x,this.lineStartPos.y, 15, 15);
			ellipse(this.lineEndPos.x,this.lineEndPos.y, 15, 15);
			// this.pos.x = this.startPos.x;
			// this.pos.y = this.startPos.y;
			//
			this.updateLinear();
		}


	}

	updatePathway(pathway){
		this.pathway = pathway;
		if (this.pathway == "CIRCULAR"){
			this.pos.x = this.center.x - this.radius;
			this.pos.y = this.center.y;
		} else if (this.pathway == "LINEAR"){
			this.lineStartPos = createVector(width/2 - this.radius,height/2);
			this.lineEndPos = createVector(width/2 + this.radius,height/2);
		this.pos.x = this.lineStartPos.x;
		this.pos.y = this.lineStartPos.y;
	}
	}

	updateFacing(facing){
		this.facing = facing;
	}

	updateRadius(value){
		this.radius = value;
	}

	updateSpeed(value){
		this.speed = value;
		this.velocity.x = this.speed*cos(this.lineDirection);
		this.velocity.y = this.speed*sin(this.lineDirection);

	}


	updateCircular(){
		this.pos.x = this.center.x + this.radius * cos(this.angle);
		this.pos.y = this.center.y + this.radius * sin(this.angle);


		// facings
		if (this.facing == "FORWARD") {
			this.arrowhead.x = -this.arrowlength * sin(this.angle);
			this.arrowhead.y = this.arrowlength * cos(this.angle);
		} else if (this.facing == "BACKWARD") {
			this.arrowhead.x = this.arrowlength * sin(this.angle);
			this.arrowhead.y = -this.arrowlength * cos(this.angle);
		} else if (this.facing == "LEFT") {
			this.arrowhead.x = this.arrowlength * cos(this.angle);
			this.arrowhead.y = this.arrowlength * sin(this.angle);
		} else if (this.facing == "RIGHT") {
			this.arrowhead.x = -this.arrowlength * cos(this.angle);
			this.arrowhead.y = -this.arrowlength * sin(this.angle);
		}


		this.angle = this.angle + this.speed/this.radius;

		// draw path below dancer
		noFill();
		stroke(255);
		ellipse(this.center.x, this.center.y, this.radius * 2);
		line(this.pos.x, this.pos.y,this.pos.x+this.arrowhead.x,this.pos.y+this.arrowhead.y)

	}

	updateLinear(){


		// calculate velocity as vector between start / end positions
		// temp hard-coded values of velocity

		//
		if(this.pos.x > this.lineEndPos.x | this.pos.x < this.lineStartPos.x ){ //if at end
			this.velocity.x = -this.velocity.x;
			this.velocity.y = -this.velocity.y;
		}

		this.pos.x += this.velocity.x; // 1
		this.pos.y += this.velocity.y; // 0

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
