//one Dancer is broken up into two objects: "SimDancer" and "Dot"
// SimDancer is responsible for a math & calculations & intializes a dot
// Dot simply scales & draws the values onto the canvas


class Dot{
	constructor(object){
		this.pos = createVector(object.x, object.y);
		this.history = [];
		this.historySize = 80;
		this.size = 15;
		this.fill = object.fill;

		this.arrow;
		this.arrowLength = 20;

		this.scale = object.scale; //passed from SimDancer and can be edited externally(in sketch.js) with SimDancer.updateScale(val);
	}

	update(object){
		// updating values from new pos & facing from SimDancer
		this.updatePosition(object.pos);
		this.updateArrow(object.facing);
	}

	updatePosition(pos){
		// Rather than using "scale()" to scale up the Dot - positions are mapped over scale value
		let scaleX = map(pos.x, 0, 100, 0, this.scale);
		let scaleY = map(pos.y, 0, 100, 0, this.scale);
		let scalePos = createVector(scaleX,scaleY);
		if(this.history.length >= this.historySize) this.history.pop();
		this.history.unshift(scalePos);
		// set current pos
		this.pos.x = scalePos.x;
		this.pos.y = scalePos.y;
	}

	updateScale(val){
		this.scale = val;
	}

	updateArrow(arrow){
		this.arrow = arrow;
	}

	updateTrace(trace){
		// not working properly
		this.historySize = trace;
	}

	drawTrace(){
		// use history to draw trace
		noStroke();
		for(var i = 0; i <= this.history.length -1 ; i++){
			fill(0,0,250,map(i,0,this.history.length, 50, 0));
			ellipse(this.history[i].x,this.history[i].y, this.size/2, this.size/2);
		}
	}

	drawArrow(){
		strokeWeight(5);
		stroke(0);
		line(this.pos.x, this.pos.y, this.pos.x + this.arrow.x*this.arrowLength, this.pos.y + this.arrow.y*this.arrowLength);
	}

	draw(){
		// The 100x100 grid is scaled to 300x300(this.scale by this.scale)
		// Translated into the center of the canvas
		push();
		translate(width/2-this.scale/2,height/2-this.scale/2);
		this.drawTrace();
		this.drawArrow();

		fill(this.fill);
		strokeWeight(0);
		ellipse(this.pos.x, this.pos.y, this.size, this.size);
		pop();
	}
}


class SimDancer{
	constructor(pos, idNum){
		this.pos = createVector(pos.x, pos.y); //used only to initialize Dot object
		this.history = [this.pos.copy()]; //history of positions - values past 1 are currently unused
		this.historySize = 10;

		// values for circular movement
		this.angle = 0;
		this.speed = 1;

		// simDancer is on a 100x100 grid scaled up in dot.draw
		this.radius = 50;
		this.center = createVector(50,50);

		// values edited in sketch.js
		this.pathway;
		this.facing;
		this.facingTarget = 'SELF';
		this.centerTarget = 'STAGE'; 
		this.facingTargetId; //ID of dancer being targetted
		this.centerTargetId;
		// values of target's positions updated from sketch.js
		this.facingTargetPos = createVector(0,1);
		this.centerTargetPos = createVector(50,50);


		this.id = idNum;
		this.stopped = false;

		this.scale = 300; //Dancer is on a 100x100 grid that is resized in Dot using this scale
		this.dot = new Dot({x: this.pos.x, y: this.pos.y, fill: color(random(255),random(255),random(255)), scale: this.scale});
	}

	update(){
		// update position and facing and push to dot class
		let newPos;
		this.updateCenter();
		switch(this.pathway){
			case 'CIRCULAR':
				newPos = this.updateCircular();
				break;
			case 'LINEAR':
				newPos = this.updateLinear();
				break;
			default:
				newPos = createVector(50,50);
				console.log('no pathway chosen');
		}
		
		this.addPosition(newPos);
		let newFace = this.updateFacing();
		// push data to inner class
		this.dot.update({pos: newPos, facing: newFace});
	}

	draw(){
		// seperate draw from update to handle play/pause
		this.dot.draw();
	}

	updateCircular(){
		// calculate NEXT position based current angle
		let newPos = createVector(this.center.x + this.radius * cos(this.angle), this.center.y + this.radius * sin(this.angle)); 
		this.angle += this.speed/this.radius;

		return newPos;
	}

	updateLinear(){
		// uses same sinusoidal motion from updateCircular
		let newPos = createVector(0,0);
		let lineStart = createVector(this.center.x - this.radius, this.center.y);
		let lineEnd = createVector(this.center.x + this.radius, this.center.y);

		this.angle += this.speed/this.radius;
		newPos.x = map(cos(this.angle), -1, 1, lineStart.x, lineEnd.x);
		newPos.y = this.center.y;
		
		return newPos;
	}

	addPosition(pos){ 
		// Add position to history
		if(this.history.length >= this.historySize) this.history.pop();
		this.history.unshift(pos);
	}

	updateFacing(){
		// Calculate facing from difference in position
		let newFacing;
		let normalized;
		// Value of normalized will change based on target
		normalized = this.getNormalized(this.facingTarget);

		switch(this.facing){
			case 'FORWARD':
				newFacing = normalized.copy();
				break;
			case 'LEFT':
				newFacing = createVector(normalized.y, - normalized.x);
				break;
			case 'RIGHT':
				newFacing = createVector(-normalized.y, normalized.x);
				break;
			case 'BACKWARD':
				newFacing = normalized.mult(-1);
				break;
			default:
				newFacing = normalized.copy();
		}
		return newFacing;
	}

	getNormalized(type){
		// Determine normalized value from facing type
		let normalized;
		switch(type){
			case 'SELF':
				// based on previous position
				normalized = createVector(this.history[0].x-this.history[1].x, this.history[0].y-this.history[1].y).normalize();
				break;
			case 'STAGE':
				normalized = createVector(0,1).normalize()
				break;
			case 'DANCER':
				// based on difference from targeted dancer 
				normalized = createVector(this.facingTargetPos.x- this.history[0].x, this.facingTargetPos.y - this.history[0].y).normalize();
				break;
		}
		return normalized;
	}

	// Update center works similarly to updating facing - choose based on centerTarget type (STAGE, DANCER, CUSTOM)
	// Custom and dancer will both update "centerTargetPos" value
	updateCenter(){
		let newCenter;
		switch(this.centerTarget){
			case 'STAGE':
				newCenter = createVector(50,50);
				break;
			case 'DANCER':
				newCenter = this.centerTargetPos.copy(); //this value (centertargetpos) is currently shared between dancer & custom
				break;
			case 'CUSTOM':
				newCenter = this.centerTargetPos.copy();
				break;
			}
		this.center = newCenter; //set value to be accessed by updateCircular/Linear
	}

	setCenterPos(newCenter){
		// centerTargetPos is updated by either targetDancer.history[0] or mouseX,mouseY clicked position
		let newVector = createVector(parseFloat(newCenter.x),parseFloat(newCenter.y));
		this.centerTargetPos = newVector;
	}

	setFacingPos(newTarget){
		let newVector = createVector(parseFloat(newTarget.x),parseFloat(newTarget.y));
		this.facingTargetPos = newVector;
	}


	//Functions called from sketch.js interface
	updateScale(val){
		// unused 
		this.dot.updateScale(val);
	}

	setPathway(pathway){
		this.pathway = pathway;
	}

	setFacing(facing){
		this.facing = facing;
	}

	setCenter(center){
		this.centerTarget = center;
	}

	setRadius(radius){
		this.radius = parseInt(radius);
	}

	setSpeed(speed){
		this.speed = map(parseInt(speed), 1, 50, 0.2 ,7);
	}

	setTrace(trace){
		this.dot.updateTrace(parseInt(trace));
	}

	setStopState(state){
		this.stopped = state;
		console.log(`dancer ${this.id} is paused: ${state}`)
	}
}