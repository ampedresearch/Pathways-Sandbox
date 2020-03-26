class Dancer {
	constructor(){
		//position
		this.pos = createVector(width/2,height/2);
		this.prevPos = createVector(0,0);
		this.arrowhead = createVector(1,1);
		this.pathway;
		this.facing = "FORWARD";
		this.arrowlength = 50;
		this.normalized = createVector(1,1);

		this.posArray = [];

		//display
		this.size = 25;
		this.fill;

		//circular vars
		this.radius = 50;
		this.angle = 0;
		this.speed = 1;
		this.center = createVector(width/2, height/2);

		// linear vars
		this.lineAngle = 0; // angle with horizontal
		this.velocity = createVector(1,1);
		this.lineStartPos;
		this.lineEndPos;

		this.frames = 0;
	}


	update(){
		if(this.pathway == null){
			textSize(24);
			text('select a pathway!', this.pos.x + this.size, this.pos.y);
		} else if (this.pathway == "CIRCULAR"){
			this.updateCircular();
		} else if (this.pathway == "LINEAR"){
			this.updateLinear();
		}

		this.updateFacingDirection(this.velocity.copy());
		this.updateTrace();
	}

	updatePathway(pathway){
		this.pathway = pathway;
		if (this.pathway == "CIRCULAR"){
			this.pos.x = this.center.x - this.radius;
			this.pos.y = this.center.y;
		} else if (this.pathway == "LINEAR"){
			this.lineStartPos = createVector(parseFloat(width/2) - parseFloat(this.radius),height/2);
			this.lineEndPos = createVector(parseFloat(width/2) + parseFloat(this.radius), height/2);
			this.lineAngle = Math.atan2(this.lineEndPos.y - this.lineStartPos.y, this.lineEndPos.x - this.lineStartPos.x);

			this.velocity.x = this.speed*cos(this.lineAngle);
			this.velocity.y = this.speed*sin(this.lineAngle);

			this.pos.x = this.lineStartPos.x;
			this.pos.y = this.lineStartPos.y;
		}
		// clear path
		this.posArray = [];
	}

	updateFacing(facing){
		this.facing = facing;
	}

	updateRadius(value){
		this.radius = value;
	}

	updateSpeed(value){
		this.speed = value;
		this.velocity.x = this.speed*cos(this.lineAngle);
		this.velocity.y = this.speed*sin(this.lineAngle);

	}

	updateFacingDirection(vel){
		// calculate from velocity
		this.normalized = vel.normalize().mult(this.arrowlength);

		switch(this.facing){
			case 'FORWARD':
				this.arrowhead = this.normalized;
				break;
			case 'BACKWARD':
				this.arrowhead = this.normalized.mult(-1);
				break;
			case 'LEFT':
				this.arrowhead = createVector(this.normalized.y,-this.normalized.x);
				break;
			case 'RIGHT':
				this.arrowhead = createVector(-this.normalized.y,this.normalized.x);
				break;
		}

		// draw facing
		strokeWeight(10);
		stroke(0);
		line(this.pos.x, this.pos.y,this.pos.x+this.arrowhead.x,this.pos.y+this.arrowhead.y);
	}


	updateCircular(){
		this.prevPos.x = this.pos.x;
		this.prevPos.y = this.pos.y;

		this.pos.x = this.center.x + this.radius * cos(this.angle);
		this.pos.y = this.center.y + this.radius * sin(this.angle);

		this.angle = this.angle + this.speed/this.radius;

		// draw path below dancer
		noFill();
		stroke(0);
		strokeWeight(5);
		ellipse(this.center.x, this.center.y, this.radius * 2);
		strokeWeight(10);
		stroke(255);

		// generate velocity
		this.velocity = createVector(this.pos.x - this.prevPos.x, this.pos.y - this.prevPos.y);
	}

	updateLinear(){
		// update start and end pos
		this.lineStartPos = createVector(parseFloat(width/2) - parseFloat(this.radius),height/2);
		this.lineEndPos = createVector(parseFloat(width/2) + parseFloat(this.radius), height/2);

		if(this.pos.x > this.lineEndPos.x | this.pos.x < this.lineStartPos.x ){ //if at end
			this.velocity = this.velocity.mult(-1);
		}

		this.pos.x += this.velocity.x; // 1
		this.pos.y += this.velocity.y; // 0

		// draw line path under dancer
		stroke(255);
		strokeWeight(5);
		line(this.lineStartPos.x,this.lineStartPos.y,this.lineEndPos.x,this.lineEndPos.y);
		fill(0);
		noStroke();
		ellipse(this.lineStartPos.x,this.lineStartPos.y, 15, 15);
		ellipse(this.lineEndPos.x,this.lineEndPos.y, 15, 15);

	}

	updateTrace(){
		this.frames += 1;

		// trace every X frames
		if (this.frames >= 10){
			this.posArray.push(this.pos.copy());
			this.frames = 0;
		}

		if(this.posArray.length >= 10){
			this.posArray.shift(); //only X length trace
		}

		// draw trace
		for(var i = 0; i <= this.posArray.length -1 ; i++){
			fill(0,0,250,90);
			noStroke();
			ellipse(this.posArray[i].x,this.posArray[i].y, 20, 20);
		}
	}

	show(){
		noStroke();
		fill(255);
		ellipse(this.pos.x,this.pos.y, this.size, this.size);
	}

}

