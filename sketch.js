// Application for visualizing and customizing various 
// pathways and facings found within dance


let dancer;

let slider;

function setup(){
	let myCanvas = createCanvas(800,400);
	myCanvas.position(50,250);
	background(255,100,100);

	dancer = new Dancer();
	slider = document.getElementById('slider');
}

function draw(){
	background(255, 100, 100);
	dancer.update();
	dancer.show();
}

// on button click
function changeState(state){
	console.log('state changed to:' + state);
	slider.value = 5;
	updateSliderVal();
	dancer.updateState(state);
}

// on slider input
function updateSliderVal(){
	dancer.updateSlider(slider.value);

	console.log('slider on ' + slider.value);
	document.getElementById('slider-value').innerHTML = 'radius : ' + slider.value;
}