// Application for visualizing and customizing various
// pathways and facings found within dance


let dancer;

let slider;

function setup(){
	let myCanvas = createCanvas(600,500);
	myCanvas.position(500,00);
	background(255,100,100);

	dancer = new Dancer();
	radiusSlider = document.getElementById('radius-slider');
	speedSlider = document.getElementById('speed-slider');
}

function draw(){
	background(255, 100, 100);
	dancer.update();
	dancer.show();
}

// on button click
function changePathway(pathway){
	// console.log('pathway changed to:' + pathway);
	updateRadiusVal();
	dancer.updatePathway(pathway);
}

// on button click
function changeFacing(facing){
	// console.log('facing changed to:' + facing);
	dancer.updateFacing(facing);
}

// on slider input
function updateRadiusVal(){
	dancer.updateRadius(radiusSlider.value);
	// console.log('slider on ' + radiusSlider.value);
	document.getElementById('radius-label').innerHTML = 'radius: ' + radiusSlider.value;
}

// on slider input
function updateSpeedVal(){
	dancer.updateSpeed(speedSlider.value);
	// console.log('slider on ' + speedSlider.value);
	document.getElementById('speed-label').innerHTML = 'speed: ' + speedSlider.value;
}
