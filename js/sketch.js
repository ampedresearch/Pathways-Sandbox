let cHeight = 0;
let cWidth = 0;

// objects
let simDancers = {};
let idCount = 1;

// Value for toggling mouseclick for custom dancer center
let selectingCustom = false;
let selectingCustomId;

function setup() {
    // canvas sizing
    cHeight = document.getElementById('canvas-div').clientHeight;
    cWidth = document.getElementById('canvas-div').clientWidth-15;
    let myCanvas = createCanvas(cWidth,cHeight);
    myCanvas.parent('canvas-div');
    // startRecord = document.getElementById
}

function draw() {
    background(238, 206, 248);

    for(const k in simDancers){   
        if(!simDancers[k].stopped){ //if not paused
            // handling passing positions between dancers here
            if(simDancers[k].facingTarget == 'DANCER'){ handleFaceTarget(k); }
            if(simDancers[k].centerTarget == 'DANCER'){ handleCenterTarget(k); }

            simDancers[k].update();
        }
        simDancers[k].draw()
    }

    if(selectingCustom){
        textSize(22);
        textAlign(CENTER, CENTER);
        text('use your mouse to select a new center!', width/2, 100);
    }
}

// functions for interface
function setPathway(pathway, id){
    console.log(id);
    simDancers[id].setPathway(pathway);
    console.log('path set to ' + pathway);
}

function setFacingDir(facing, id){
    // Forward,backward,left,right (see "setFacings" for stage,self,dancer)
    simDancers[id].setFacingDir(facing);
    console.log('facing set to ' + facing);
}

function setRadius(id){
    let rSlider = document.getElementById(`radius-slider${id}`);
    let radius = rSlider.value;
    simDancers[id].setRadius(radius);
    document.getElementById(`radius-label${id}`).innerHTML = radius;
}

function setSpeed(id){
    let spSlider = document.getElementById(`speed-slider${id}`);
    let speed = spSlider.value;
    simDancers[id].setSpeed(speed);
    document.getElementById(`speed-label${id}`).innerHTML = speed;
}

////////// not working - not passing to Dot object
function setTrace(id){
    let trSlider = document.getElementById(`trace-slider${id}`);
    let trace = trSlider.value;
    simDancers[id].setTrace(trace);
    document.getElementById(`trace-label${id}`).innerHTML = trace;
}

function addDancer(){
    let idNum = idCount;
    idCount += 1; //counter
    let id = "dancer" + idNum;
    // If you'd like to customize the interface based on dot color you would pass that here
    let newDancer = new SimDancer(createVector(50,50), idNum); 
    simDancers[idNum] = newDancer; 

    // This section handles all HTML & interface appending

    // First add THIS new dancer to all exisiting dancer target lists
    let thisTarget = `<option class="target-item target${idNum}" id=${idNum} value="DANCER">dancer${idNum}</option>`;
    $(`.target-select`).append(thisTarget);

    // Then make string list of all OTHER dancers to add to this dancer's target list
    let targets = "";
    for(const j in simDancers){
        if(j != idNum){ targets += `<option class="target-item target${j}" id=${j} value="DANCER">dancer${j}</option>`; }
    }

    let thisHTML = `
    <div class='dancer' id='${id}'>

    <div id='heading${idNum}' style="width:50%;">
        <button class='btn btn-primary dancer-btn' type='button' data-toggle='collapse' data-target='#${id}collapse' aria-expanded='false' aria-controls='${id}collapse'>
            Dancer ${idNum} Options
        </button>
        <div class="custom-control play-switch" style="width:10%;">
            <!-- style to look like play/pause btn -->
            <input type="checkbox" class="custom-control-input custom-switch play-switch" id="${id}-switch" onClick="handlePauseButton(this, ${idNum})"><label class="custom-control-label" for="${id}-switch">pause</label>
        </div>
    </div>

    <div class='collapse' id='${id}collapse' aria-labelledby="heading${idNum}" data-parent="#dancers-container">
    <div class='sliders form-group'>
        <label for="radius-slider${idNum}">Radius</label><input type='range' class='slider' id='radius-slider${idNum}' value=25 max=50 min=10 onInput='setRadius(${idNum})'><label class='value' id="radius-label${idNum}">25</label>
        <label>Speed</label><input type='range' class='slider' id='speed-slider${idNum}' value=25 max=50 min=1 onInput='setSpeed(${idNum})'><label class='value' id="speed-label${idNum}">25</label>
        <label>Trace length</label><input type='range' class='slider' id='trace-slider${idNum}' value=50 max=100 min=0 onInput='setTrace(${idNum})'><label class='value' id="trace-label${idNum}">50</label>
    </div>

    <div class="pathways form-group">
        <label for="${idNum}Pathways">Pathway Type:</label>
        <div class='btn-group btn-group-toggle' id="${idNum}Pathways" data-toggle="buttons">
            <label class="btn btn-secondary" id="CIRCULAR" onClick='setPathway(this.id, ${idNum})'>
            <input type="radio" name="pathways" autocomplete="off"> Circular
            </label>
            <label class="btn btn-secondary" id="LINEAR" onClick='setPathway(this.id, ${idNum})'>
            <input type="radio" name="pathways" autocomplete="off"> Linear
            </label>     
        </div>

        <label for="${id}Centers">Center:</label>
        <div class='btn-group btn-group-sm btn-group-toggle' id="${idNum}Centers" data-toggle="buttons">
            <label class="btn btn-secondary active" id="STAGE" onClick='setCenter(this.id, ${idNum})'>
            <input type="radio" name="pathways" autocomplete="off"> Stage
            </label>
            <label class="btn btn-secondary" id="CUSTOM" onClick='setCenter(this.id, ${idNum})'>
            <input type="radio" name="pathways" autocomplete="off"> Custom
            </label>
            <label class="btn btn-secondary" id="DANCER" onClick='setCenter(this.id, ${idNum})'>
            <input type="radio" name="pathways" autocomplete="off"> Dancer
            </label>     
        </div>
        <select class="form-control target-select" id="${id}-center-target" onChange='setCenterTargets(this, ${idNum})'>
            ${targets} 
        </select>
    </div>

    <div class='facings form-group'>
        <label for="${id}FacingTargets">Facing Targets:</label>
        <div class='btn-group btn-group-sm btn-group-toggle' id="${idNum}FacingTargets" data-toggle="buttons">
            <label class="btn btn-secondary active" id="SELF" onClick='setFacing(this.id, ${idNum})'>
            <input type="radio" name="pathways" autocomplete="off"> Self
            </label>
            <label class="btn btn-secondary" id="STAGE" onClick='setFacing(this.id, ${idNum})'>
            <input type="radio" name="pathways" autocomplete="off"> Stage
            </label>
            <label class="btn btn-secondary" id="DANCER" onClick='setFacing(this.id, ${idNum})'>
            <input type="radio" name="pathways" autocomplete="off"> Dancer
            </label>     
        </div>
        <select class="form-control target-select" id="${id}-facing-target" onChange='setFacingTargets(this, ${idNum})'>
            ${targets} 
        </select>
        <div class='facings btn-group btn-group-sm btn-group-toggle' id="facings-${idNum}" data-toggle="buttons">
            <label class="btn btn-secondary active" id="FORWARD" onClick='setFacingDir(this.id, ${idNum})'>
            <input type="radio" name="facing" autocomplete="off">Forward</label>
            <label class="btn btn-secondary" id="BACKWARD" onClick='setFacingDir(this.id, ${idNum})'>
            <input type="radio" name="facing" autocomplete="off">Backward</label>
            <label class="btn btn-secondary" id="LEFT" onClick='setFacingDir(this.id, ${idNum})'>
            <input type="radio" name="facing" autocomplete="off">Left</label>
            <label class="btn btn-secondary" id="RIGHT" onClick='setFacingDir(this.id, ${idNum})'>
            <input type="radio" name="facing" autocomplete="off">Right</label>
        </div>
    </div>

    <button class='removeDancer' onClick='removeDancer(${idNum})'>Remove Dancer ${idNum}</button>
    </div>

    </div> `

    $("#dancers-container").append(thisHTML);
}

function removeDancer(dancerId){
    delete simDancers[dancerId];
    let id = '#dancer' + dancerId;
    // remove all interface references
    $(id).remove();
    $(`.target${dancerId}`).remove();
}


///////////////////////////Target Handling//////////////////////////////////////
// Functions for handling facing and center targets
// "setCenter" sets the type "DANCER, STAGE, or CUSTOM" - for DANCER it will set the correct ID and for CUSTOM it will toggle mouse click for center
// "setCenterTargets" is for when dancer target drop-down menu is changed (but not buttons)
// "handleCenterTargets" is called in draw() when target = DANCER - passes targeted dancer's position to this dancer
// Facings functions work the same (function for forward/backward/left/right is "setFacingDir()")

function setCenter(center, idNum){
    // Set centering type (DANCER, CUSTOM, STAGE) from button group
    simDancers[idNum].setCenter(center);

    if(center == 'DANCER'){
        // Get selected dancer ID from center-target drop down menu
        let targetId;
        let item = document.getElementById(`dancer${idNum}-center-target`);
        let options = item.options;
        targetId = options[options.selectedIndex].id;
        simDancers[idNum].centerTargetId = targetId;
    }
    if(center == 'CUSTOM'){
        // Custom will pause all dancers, and make "selection mode" active until the mouse is clicked
        pauseDancers(true);
        selectingCustom = true;
        selectingCustomId = idNum;
    }
}

function mousePressed(){
    // When the mouse is clicked the new position is sent to Dancer objects & all dancers play
    if(selectingCustom){
        let pos = createVector(mouseX,mouseY);
        // Since Dancer's 100x100 grid is translated to the center of the screen & scaled by Dancer.scale
        // We need to reverse-work this so the dancer is properly displayed
        let translatedPos = createVector(0,0);
        translatedPos.x = mouseX - (width/2 - simDancers[selectingCustomId].scale/2);
        translatedPos.y = mouseY - (height/2 - simDancers[selectingCustomId].scale/2);
        let scaledPos = createVector(0,0);
        scaledPos.x = map(translatedPos.x, 0, simDancers[selectingCustomId].scale,0, 100);
        scaledPos.y = map(translatedPos.y, 0, simDancers[selectingCustomId].scale,0, 100);

        simDancers[selectingCustomId].setCenterPos(scaledPos);
        pauseDancers(false);
        selectingCustom = false;
    }
}

function setCenterTargets(item, idNum){
    // same as "setCenter" but for when ONLY the drop-down menu is changed. Maybe find a way to consolidate these functions?
    // Update ID of targeted dancer when drop-down is changed
    let options = item.options;
    let targetId = options[options.selectedIndex].id;
    simDancers[idNum].centerTargetId = targetId;
}

// These two functions work the same as setCenter & setCenter Targets //

function setFacing(target, idNum){
    // Set centering type (SELF, DANCER, STAGE) from button group 
    simDancers[idNum].facingTarget = target;

    if(target == 'DANCER'){
        let targetId; //get ID
        let item = document.getElementById(`dancer${idNum}-facing-target`);
        let options = item.options;
        targetId = options[options.selectedIndex].id;
        simDancers[idNum].facingTargetId = targetId;
    }
}

function setFacingTargets(item, idNum){
    let options = item.options;
    let targetId = options[options.selectedIndex].id;
    simDancers[idNum].facingTargetId = targetId;
}


// "handleTarget" functions pass position values between dancers for constantly updated values (called in draW())

function handleFaceTarget(idNum){
    // Handle updating the facing value when target is another dancer (called in Draw() from IF statement)
    let targetId = simDancers[idNum].facingTargetId;
    let target = simDancers[targetId];
    let newTarget = createVector(parseFloat(target.history[0].x),parseFloat(target.history[0].y));
    simDancers[idNum].setFacingPos(newTarget);
}

function handleCenterTarget(idNum){
    // Handle updating the center value when target is another dancer (called in Draw() from IF statement)
    let targetId = simDancers[idNum].centerTargetId;
    let target = simDancers[targetId];
    let newCenter = createVector(parseFloat(target.history[0].x),parseFloat(target.history[0].y));
    simDancers[idNum].setCenterPos(newCenter);
}

/////////////////////////////////////////////////////////////////////////


function handlePauseButton(button, idNum){
    let state = button.checked;
    simDancers[idNum].setStopState(state);
}

function pauseDancers(state){
    $('.play-switch').prop("checked", state);
        for(const k in simDancers){ 
            simDancers[k].setStopState(state);  
        }
}

function windowResized(){
    let cHeight = document.getElementById('canvas-div').clientHeight;
    let cWidth = document.getElementById('canvas-div').clientWidth-15;
    resizeCanvas(cWidth,cHeight);
}