let cHeight = 0;
let cWidth = 0;

// objects
let simDancers = {};
let idCount = 1;

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
        if(!simDancers[k].stopped){ 
            // where and how else should i do this?
            if(simDancers[k].facingTarget == 'DANCER'){ setFaceTarget(k); }
            if(simDancers[k].centerTarget == 'DANCER'){ setCenterTarget(k); }

            simDancers[k].update();
        }
        simDancers[k].draw()
    }
}

function setPathway(pathway, id){
    console.log(id);
    simDancers[id].setPathway(pathway);
    console.log('path set to ' + pathway);
}

function setFacing(facing, id){
    simDancers[id].setFacing(facing);
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

////////// in progress
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
    let newDancer = new SimDancer(createVector(50,50), idNum); //should also pass color
    simDancers[idNum] = newDancer; 

    // need to add target here.. MOVE TO DIFFERENT FUNCTION?
    let thisTarget = `<option class="target-item target${idNum}" id=${idNum} value="DANCER">dancer${idNum}</option>`;
    $(`.target-select`).append(thisTarget);

    let targets = ""; //make targets list
    for(const j in simDancers){
        if(j != idNum){
            targets += `<option class="target-item target${j}" id=${j} value="DANCER">dancer${j}</option>`;
        }
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

        <label for="${id}-center-target">Center:</label>
        <select class="form-control target-select" id="${id}-center-target" onClick='handleCenterTargets(this, ${idNum})'>
            <option class="target-item" id='stage-center' value="STAGE">Stage</option>
            ${targets} 
        </select>
    </div>

    <div class='facings form-group'>
        <label for="${id}-facing-target">Facing:</label>
        <select class="form-control target-select" id="${id}-facing-target" onClick='handleFaceTargets(this, ${idNum})'>
            <option class="target-item" id="self-face" value="SELF">Self</option>
            <option class="target-item" id="stage-face" value="STAGE">Stage</option>
            ${targets} 
        </select>
        <div class='facings btn-group btn-group-sm btn-group-toggle' id="facings-${idNum}" data-toggle="buttons">
            <label class="btn btn-secondary" id="FORWARD" onClick='setFacing(this.id, ${idNum})'>
            <input type="radio" name="facing" autocomplete="off" checked>Forward</label>
            <label class="btn btn-secondary" id="BACKWARD" onClick='setFacing(this.id, ${idNum})'>
            <input type="radio" name="facing" autocomplete="off">Backward</label>
            <label class="btn btn-secondary" id="LEFT" onClick='setFacing(this.id, ${idNum})'>
            <input type="radio" name="facing" autocomplete="off">Left</label>
            <label class="btn btn-secondary" id="RIGHT" onClick='setFacing(this.id, ${idNum})'>
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
    $(id).remove();
    $(`.target${dancerId}`).remove();
}

function handleFaceTargets(item, idNum){
    let value = item.value;
    let options = item.options;
    let id = options[options.selectedIndex].id;
    // break up DANCER and dancer id for targets....
    simDancers[idNum].facingTarget = value;
    if(value == 'DANCER'){
        simDancers[idNum].facingTargetId = id;
        console.log(`dancer${idNum} is facing dacner ${id}`);
    }
}

function handleCenterTargets(item, idNum){
    let value = item.value;
    let options = item.options;
    let id = options[options.selectedIndex].id;
    // break up DANCER and dancer id for targets....
    simDancers[idNum].centerTarget = value; //maybe make a function within Dancer.js
    if(value === 'DANCER'){
        simDancers[idNum].centerTargetId = id;
    }
}

function setFaceTarget(idNum){
    let targetId = simDancers[idNum].facingTargetId;
    let target = simDancers[targetId];
    simDancers[idNum].targetPos = target.history[0];
}

function setCenterTarget(idNum){
    let targetId = simDancers[idNum].centerTargetId;
    let target = simDancers[targetId];
    let newCenter = createVector(parseFloat(target.history[0].x),parseFloat(target.history[0].y));
    simDancers[idNum].updateCenter(newCenter);
}

function handlePauseButton(button, idNum){
    let state = button.checked;
    simDancers[idNum].setStopState(state);
}

function pauseDancers(state){
    $('.play-switch').prop("checked", state);
        for(const k in simDancers){ 
            simDancers[k].stopped = state;  
        }
}

function windowResized(){
    let cHeight = document.getElementById('canvas-div').clientHeight;
    let cWidth = document.getElementById('canvas-div').clientWidth-15;
    resizeCanvas(cWidth,cHeight);
}