//Get HTML elements

var menu = document.getElementById("menu");
var handle = document.getElementById("handle");
var maximizeButton = document.getElementById("maximize-button");
var minimizeButton = document.getElementById("minimize-button");
var settingsArray = Array.from(document.querySelectorAll(".settings"));
var settingsSvgArray = Array.from(document.querySelectorAll(".settings-svg"));

var changeVelocityField = document.getElementById("change-velocity-field");
var velocityFieldDisplay = document.getElementById("velocity-field-display");
var velocityFieldInput = document.getElementById("velocity-field-input");
var defaultEquation = ["x", "y"];
var normalTooltip = document.getElementById("normal-tooltip");
var errorTooltip = document.getElementById("error-tooltip");

var particleCanvas = document.getElementById("particle-canvas");
var showParticlesCheck = document.getElementById("show-particles");
var particleCountSlider = document.getElementById("particle-count");
var particleCountDisplay = document.getElementById("particle-count-display");
var particleSizeSlider = document.getElementById("particle-size");
var particleSizeDisplay = document.getElementById("particle-size-display");
var colorOffsetSlider = document.getElementById("color-offset");
var colorOffsetDisplay = document.getElementById("color-offset-display");
var colorOptionsArray = Array.from(document.querySelectorAll(".color-options"));
var particleStreamCheck = document.getElementById("particle-stream");

var gridCanvas = document.getElementById("grid-canvas");
var vectorCanvas = document.getElementById("vector-canvas");
var showVectorsCheck = document.getElementById("show-vectors");
var normalizeVectorsCheck = document.getElementById("normalize-vectors");
var vectorDensitySlider = document.getElementById("vector-density");
var vectorDensityDisplay = document.getElementById("vector-density-display");
var vectorLengthSlider = document.getElementById("vector-length");
var vectorLengthDisplay = document.getElementById("vector-length-display");
var showGridCheck = document.getElementById("show-grid");
var showVectorFieldDetailsCheck = document.getElementById("show-vector-field-details");

const modalContainerArray = Array.from(document.querySelectorAll(".modal-container"));
const closeModalSvgArray = Array.from(document.querySelectorAll(".close-modal-svg"));
const openModalButtonArray = Array.from(document.querySelectorAll(".open-modal-button"));
const closeModalButtonArray = Array.from(document.querySelectorAll(".close-modal-button"));
const goBackButton = document.getElementById("go-back-button");

const instructionsModalInputForm = document.getElementById("instructions-modal-velocity-field-input");
const instructionsModalErrorImg = document.getElementById("instructions-modal-error-img");
const instructionsModalExampleButton = document.getElementById("instructions-modal-example-button");
const presetModalContainer = document.getElementById("preset-modal-container");
const presetModal = document.getElementById("preset-modal");
const presetContainer = document.getElementById("preset-container");
const presetNamesArray = ['x, y', 'x, x-y', 'y-x, -x-y', 'y-x, x-y', '-x*y, x^2-y^2', 'sin(x*y), cos(x*y)', 
                        'cos(y), sin(x)', 'x^2, x*y', 'x^3+x^2y^2, x^3y+y^5', 'x, sin(2x)', 'sin(x), x', '-x*y, y^2-x^2',
                        'sin(2x), sin(2y)', 'x*y, -x^2-y^2', 'x-y, x', 'sign(x), 0', 'ln(abs(y)), ln(abs(x))', 'ln(abs(sin(x))), -ln(abs(cos(y)))',
                        '3(2x^3-3x*y^2)/4(x^2+y^2)^(7/2), -3y(y^2-4x^2)/4(x^2+y^2)^(7/2)', 'x*sin(y), y*cos(x)',
                        'y*sin(y), x*cos(x)', 'sin(x)-sin(y), sin(x)+sin(y)', 'sinh(x), cosh(y)', 'x^2*y, -x-y'];


instructionsModalExampleButton.addEventListener("click", () => {
    var value = instructionsModalInputForm.value;
    while(value == instructionsModalInputForm.value){
        var functionName = presetNamesArray[Math.floor(Math.random() * presetNamesArray.length)];
        var value = `F(x, y) = < ${functionName} >`;
    }
    instructionsModalInputForm.value = value;
})

for(var i = 0; i < modalContainerArray.length; i++){
    (function(index){
        var modalContainer = modalContainerArray[index];
        var closeModalSvg = closeModalSvgArray[index];
        var openModalButton = openModalButtonArray[index];
        var closeModalButton = closeModalButtonArray[index];
        
        openModalButton.onclick = function(){
            if(modalContainer.id == "preset-modal-container"){
                resizePresetModal();
            }
            modalContainer.classList.remove("hidden");
        }

        closeModalButton.onclick = function(){
            modalContainer.classList.add("hidden");
            if(modalContainer.id == "instructions-modal-container"){
                instructionsModalInputForm.value = "F(x, y) = < x-y, x+y >";
                if(!instructionsModalErrorImg.classList.contains("hidden")){
                    instructionsModalErrorImg.classList.add("hidden");
                }
            }
        }

        closeModalSvg.onclick = function(){
            modalContainer.classList.add("hidden");
        }

    }(i));
}

for(var i = 0; i < presetNamesArray.length; i++){

    (function(index){

        var preset = document.createElement("div");
        preset.className = "preset";
        preset.style.backgroundImage = `url("presets/${presetNamesArray[index].replaceAll('*', '~').replaceAll('/', '&')}.jpg")`;

        values = presetNamesArray[index].replace(/(?<=[xy])(\*)(?=[xy])/gi, '').split(',');

        var functionName = 
        '\\(' + 
        '\\mathbf{F}(x,y)=\\left&lt' + 
        math.parse(values[0]).toTex() + 
        ',' + 
        math.parse(values[1]).toTex() + 
        '\\right&gt' + 
        '\\)';
        preset.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" class="preset-check"><path fill="transparent" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg><div class="preset-info"><p class="equation">${functionName}</p></div>`;
        presetContainer.appendChild(preset);

        preset.onclick = function(){
            preset.classList.add("active");
            setTimeout(() => {
                preset.classList.remove("active");
            }, 1000);
            parseInput(presetNamesArray[index]);
        }
    })(i)

}

goBackButton.onclick = function(){
    normalTooltip.classList.remove("hidden");
    errorTooltip.classList.add("hidden");
}

var resizePresetModal = function(){
    if(innerWidth > 1275) presetModal.style.width = "1020px";
    else if(innerWidth > 950) presetModal.style.width = "702px";
    else presetModal.style.width = "385px";
}

//Canvas settings

particleCanvas.width = window.innerWidth;
particleCanvas.height = window.innerHeight;
particleCanvas.style.background = "rgb(16, 20, 30, 1)";

gridCanvas.width = window.innerWidth;
gridCanvas.height = window.innerHeight;
vectorCanvas.width = window.innerWidth;
vectorCanvas.height = window.innerHeight;

var c = particleCanvas.getContext('2d');
var ctx = gridCanvas.getContext('2d');
var ctxv = vectorCanvas.getContext('2d');

//Initialize constants

const MAXCOUNT = 2000;
const MAXSPEED = 30;
const MAXLIFESPAN = 500;
const ALPHA = 1;
const e = Math.E;
const pi = Math.PI;

const CMSFont = new FontFace('Computer Modern Serif', 'url(resources/computer-modern.ttf)');
const superScripts = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '¹⁰', '¹¹', '¹²'];
const pixelperBox = 35;

//Initialize variables

var mouse = {'x': undefined, 'y': undefined};
var isResizing = false;
var minimize = false;

var equation1 = undefined;
var equation2 = undefined;
var flux = -1000;

var particleAttributes = {
    "show": undefined,
    "particleCount": undefined, 
    "particleSize": undefined,
    "colorOffset": undefined,
    "colorCodeWithAngle": undefined,
    "colorCodeWithSpeed": undefined
}
var artificialParticleAttributes = {
    "status": true,
    "count": 0,
    "maxCount": 500
}

//Grid variables

var isResizingCanvas = false;
var isInsideCanvas = false;
var initial = {'x': undefined, 'y': undefined};
var shift = {'x': 0, 'y': 0};
var factor = 0.8;
var vectorAttributes = {
    "show": undefined,
    "normalize": undefined, 
    "vectorSpacing": undefined, 
    "vectorLength": undefined,
    "showDetails": undefined
};
var gridAttributes = {
    "show": undefined,
    "spacing": 1
}

//Utility functions

handle.onmousedown = function(e) {
    isResizing = true;
};
    
document.onmousemove = function(e) {
    mouse.x = e.x;
    mouse.y = e.y;

    if (!isResizing) return;
    var offsetRight = e.clientX;

    if(offsetRight > 300) offsetRight = 340;
    else if(offsetRight < 30) offsetRight = 0;

    menu.style.transition = "0s";
    menu.style.width = offsetRight + "px";
}

document.onmouseup = function(e) {
    isResizing = false;
}

maximizeButton.onclick = function(){
    menu.style.width = "340px";
}

minimizeButton.onclick = function(){
        menu.style.width = "0";
}

window.addEventListener('resize', function(){
    var width = window.innerWidth;
    var height = window.innerHeight;

    particleCanvas.width = width;
    particleCanvas.height = height;
    gridCanvas.width = width;
    gridCanvas.height = height;
    vectorCanvas.width = width;
    vectorCanvas.height = height;

    if(!presetModalContainer.classList.contains("hidden")) resizePresetModal();
    refresh();
});

velocityFieldInput.addEventListener("keyup", function(event){
    if(event.key === 'Enter'){

        var valid = parseInput(velocityFieldInput.value);

        if(valid){
            if(normalTooltip.classList.contains("hidden")){
                normalTooltip.classList.remove("hidden");
                errorTooltip.classList.add("hidden");
            }
        }
        else{
            if(!normalTooltip.classList.contains("hidden")){
                normalTooltip.classList.add("hidden");
                errorTooltip.classList.remove("hidden");
            }
        }
    }
})

instructionsModalInputForm.addEventListener("keyup", function(event){
    if(event.key === 'Enter'){

        var valid = parseInput(instructionsModalInputForm.value);

        if(valid){
            if(!instructionsModalErrorImg.classList.contains("hidden")){
                instructionsModalErrorImg.classList.add("hidden");
            }
        }
        else{
            if(instructionsModalErrorImg.classList.contains("hidden")){
                instructionsModalErrorImg.classList.remove("hidden");
            }
        }
    }
})

gridCanvas.onmousedown = function(e) {
    initial.x = e.x;
    initial.y = e.y;
    isResizingCanvas = true;
};
    
gridCanvas.onmousemove = function(e) {
    if(vectorAttributes.showDetails && isInsideCanvas){
        refreshVector();
    }

    if (!isResizingCanvas) return;
    var x = e.x;
    var y = e.y;

    shift.x += (initial.x - x) / (pixelperBox * factor);
    shift.y += - (initial.y - y) / (pixelperBox * factor);
    refresh();

    initial.x = x;
    initial.y = y;
}

gridCanvas.onmouseup = function() {
    isResizingCanvas = false;
}

gridCanvas.onmouseenter = function(){
    isInsideCanvas = true;
}

gridCanvas.onmouseout = function(){
    isInsideCanvas = false;
    ctxv.clearRect(0, 0, innerWidth, innerHeight);
}

gridCanvas.onwheel = function(e){
    var zoom = 1;
    if (e.deltaY < 0 && factor < 10 ** 10){
        zoom = 1.05;
    }
    else if(e.deltaY > 0 && factor > 10 ** -9) zoom = 1 / 1.05;

    mouseDistX = e.x - innerWidth / 2;
    mouseDistY = e.y - innerHeight / 2;
    
    shift.x += mouseDistX / (pixelperBox * factor);
    shift.y -= mouseDistY / (pixelperBox * factor);

    factor *= zoom;

    shift.x -= mouseDistX / (pixelperBox * factor);
    shift.y += mouseDistY / (pixelperBox * factor);

    gridAttributes.spacing = 1;
    var invFactor = 1 / factor;
    if(invFactor > 1){
        for(var i = 0; i < 12; i++){
            if(invFactor > 1 * 10 ** i) gridAttributes.spacing = 1 * 10 ** i;
            if(invFactor > 2 * 10 ** i) gridAttributes.spacing = 2 * 10 ** i;
            if(invFactor > 4 * 10 ** i) gridAttributes.spacing = 4 * 10 ** i;
        }
    }
    else if(invFactor < 1){
        for(var i = 0; i < 10; i++){
            if(invFactor < 1 * 10 ** -i) gridAttributes.spacing = 4 * 10 ** -(i + 1);
            if(invFactor < 4 * 10 ** -(i + 1)) gridAttributes.spacing = 2 * 10 ** -(i + 1);
            if(invFactor < 2 * 10 ** -(i + 1)) gridAttributes.spacing = 1 * 10 ** -(i + 1);
        }
    }
    refresh();
}

particleAttributes.show = showParticlesCheck.checked;
showParticlesCheck.oninput = function(){
    particleAttributes.show = showParticlesCheck.checked;
}

particleAttributes.particleCount = particleCountSlider.value;
particleCountDisplay.innerHTML = particleCountSlider.value;
particleCountSlider.oninput = function(){
    particleAttributes.particleCount = particleCountSlider.value;
    particleCountDisplay.innerHTML = particleCountSlider.value;
}

particleAttributes.particleSize = particleSizeSlider.value;
particleSizeDisplay.innerHTML = particleSizeSlider.value;
particleSizeSlider.oninput = function(){
    particleAttributes.particleSize = particleSizeSlider.value;
    particleSizeDisplay.innerHTML = particleSizeSlider.value;
}

particleAttributes.colorOffset = colorOffsetSlider.value;
colorOffsetDisplay.innerHTML = colorOffsetSlider.value;
colorOffsetSlider.oninput = function(){
    particleAttributes.colorOffset = colorOffsetSlider.value;
    colorOffsetDisplay.innerHTML = colorOffsetSlider.value;
    for(var i = 0; i < particleArray.length; i++){
        particleArray[i].color = 'hsl(shade, 50%, 50%)'.replace('shade', parseInt(particleAttributes.colorOffset) + Math.random() * 20);
    }
}

particleAttributes.colorCodeWithAngle = colorOptionsArray[1].checked;
particleAttributes.colorCodeWithSpeed = colorOptionsArray[2].checked;
for(var i = 0; i < colorOptionsArray.length; i++){
    (function(index){
        colorOptionsArray[index].oninput = function(){
            particleAttributes.colorCodeWithAngle = false;
            particleAttributes.colorCodeWithSpeed = false;
            if(colorOptionsArray[1].checked) particleAttributes.colorCodeWithAngle = true;
            else if(colorOptionsArray[2].checked) particleAttributes.colorCodeWithSpeed = true;
        }
    })(i)
}

artificialParticleAttributes.status = particleStreamCheck.checked;
particleStreamCheck.oninput = function(){
    artificialParticleAttributes.status = particleStreamCheck.checked;
}

vectorAttributes.show = showVectorsCheck.checked;
showVectorsCheck.oninput = function(){
    vectorAttributes.show = showVectorsCheck.checked;
    refresh();
}

vectorAttributes.normalize = normalizeVectorsCheck.checked;
normalizeVectorsCheck.oninput = function(){
    vectorAttributes.normalize = normalizeVectorsCheck.checked;
    refresh();
}

var vectorDensityLookup = {
    '0': ["Low", 5],
    '1': ["Medium", 2],
    '2': ["High", 1],
};
vectorDensityDisplay.innerHTML = vectorDensityLookup[vectorDensitySlider.value][0];
vectorAttributes.vectorSpacing = vectorDensityLookup[vectorDensitySlider.value][1];

vectorDensitySlider.oninput = function(){
    vectorDensityDisplay.innerHTML = vectorDensityLookup[vectorDensitySlider.value][0];
    vectorAttributes.vectorSpacing = vectorDensityLookup[vectorDensitySlider.value][1];
    refresh();
}

vectorAttributes.vectorLength = 0.1 * 1.0471285481 ** vectorLengthSlider.value;
vectorLengthDisplay.innerHTML = Math.round(vectorAttributes.vectorLength * 100) / 100;

vectorLengthSlider.oninput = function(){
    vectorAttributes.vectorLength = 0.1 * 1.0471285481 ** vectorLengthSlider.value;
    vectorLengthDisplay.innerHTML = Math.round(vectorAttributes.vectorLength * 100) / 100;
    refresh();
}

gridAttributes.show = showGridCheck.checked;
showGridCheck.oninput = function(){
    gridAttributes.show = showGridCheck.checked;
    refresh();
}

vectorAttributes.showDetails = showVectorFieldDetailsCheck.checked;
if(vectorAttributes.showDetails) gridCanvas.style.cursor = "none";
else gridCanvas.style.cursor = "auto";
showVectorFieldDetailsCheck.oninput = function(){
    vectorAttributes.showDetails = showVectorFieldDetailsCheck.checked;
    if(vectorAttributes.showDetails) gridCanvas.style.cursor = "none";
    else gridCanvas.style.cursor = "auto";
    refresh();
}


for(var i = 0; i < settingsArray.length; i++){
    (function(index){
        var setting = settingsArray[index];
        var settingSvg = settingsSvgArray[index]; 
        setting.onclick = function(){
            if(!setting.classList.contains("expanded")) setting.classList.add("expanded");
        }
        settingSvg.onclick = function(event){
            event.stopPropagation();
            if(setting.classList.contains("expanded")) setting.classList.remove("expanded");
        }
    }(i));
}

var ptuX = function(px){
    return (px - innerWidth  / 2) / (pixelperBox * factor) + shift.x;
}

var ptuY = function(py){
    return - (py - innerHeight / 2) / (pixelperBox * factor) + shift.y;
}

var utpX = function(ux){
    return (ux - shift.x) * (pixelperBox * factor) + innerWidth / 2;
}

var utpY = function(uy){
    return - (uy - shift.y) * (pixelperBox * factor) + innerHeight / 2;
}

var parseInput = function(value){
    var value = autocorrect(value).split(/(?<!\(),(?![\w\s]*[\)])/g, 2);
    var valid = undefined;
    if(value.length == 1) valid = updateVectorFunction(value[0], value[0]);
    else valid = updateVectorFunction(value[0], value[1]);
    return valid;
}

var updateVectorFunction = function(value1, value2){

    var tempEquation1, tempEquation2;

    try{
        tempEquation1 = evaluatex(capitalizeE_PI(value1));
        tempEquation2 = evaluatex(capitalizeE_PI(value2));

        tempEquation1({x:0, y:0});
        tempEquation2({x:0, y:0});

        velocityFieldDisplay.innerHTML = 
        '\\(' + 
        '\\mathbf{F}(x,y)=\\left&lt' + 
        math.parse(value1.replace(/(?<=[xy])(\*)(?=[xy])/gi, '')).toTex() + 
        ',' + 
        math.parse(value2.replace(/(?<=[xy])(\*)(?=[xy])/gi, '')).toTex() + 
        '\\right&gt' + 
        '\\)';
    }
    catch(error){
        console.log(error);
        return false;
    }
    equation1 = tempEquation1;
    equation2 = tempEquation2;
    MathJax.typeset();
    refresh();

    return true;

}

var getVectorFunctionValue = function(valueX, valueY){
    answer = undefined;
    try{
        answer = [equation1({x: valueX, y: valueY}), equation2({x: valueX, y: valueY})];
    }
    catch(error){
        answer = [NaN, NaN];
    }
    return answer;
}

var sciNotation = function(num, sf){
    var str = [];
    var abs = Math.abs(num);

    if(abs < 10 ** -12) return 0;
    else if(abs >= 1) str = num.toExponential().split("e+");
    else str = num.toExponential().split("e-");

    var truncate = str[0].substring(str[0].indexOf(".") + sf);
    var base = str[0].replace(truncate, "");
    var exponent = str[1];

    if(abs > 100000) return base + " ⋅ 10" + superScripts[exponent];
    else if(abs < 0.001) return base + " ⋅ 10⁻" + superScripts[exponent];
    else if(abs >= 1) return Math.round((base * 10 ** exponent) * 10 ** sf) / 10 ** sf;
    else return Math.round((base * 10 ** -exponent) * 10 ** (parseInt(sf) + parseInt(exponent))) / 10 ** (parseInt(sf) + parseInt(exponent));
}

var exactModulus = function(num, mod){
    var convFactor = 1;
    var numFactor = 1;
    var modFactor = 1;

    if(num == 0) return 0;

    if(Math.abs(num) < 1){
        var numString = num.toExponential().split("e-")[0];
        var numExponent = parseInt(num.toExponential().split("e-")[1]);
        if(numString.includes(".")) numFactor = 10 ** (parseInt(numString.split(".")[1].length) + numExponent);
        else numFactor = 10 ** numExponent;
    }
    else{
        var numString = num.toExponential().split("e+")[0];
        if(numString.includes(".")) numFactor = 10 ** parseInt(numString.split(".")[1].length);
    }

    if(Math.abs(mod) < 1){
        var modString = mod.toExponential().split("e-")[0];
        var modExponent = parseInt(mod.toExponential().split("e-")[1]);
        if(modString.includes(".")) modFactor = 10 ** (parseInt(modString.split(".")[1].length) + modExponent);
        else modFactor = 10 ** modExponent;
    }
    convFactor = Math.max(numFactor, modFactor);
    var answer = (Math.round(num * convFactor) % Math.round(mod * convFactor)) / convFactor;

    return answer;
}

var rotate = function(x, y, angle){
    xNew = x * Math.cos(angle) - y * Math.sin(angle);
    yNew = x * Math.sin(angle) + y * Math.cos(angle);
    return [xNew, yNew];
}


class Particle {
    constructor(x, y) {
        this.active = true;
        this.lifespan = Math.random() * 150;
        this.x = x;
        this.y = y;
        this.prevX = x;
        this.prevY = y;
        this.widthModifier = Math.random() * 0.5 + 0.5;
        this.color = 'hsl(shade, 50%, 50%)'.replace('shade', parseInt(particleAttributes.colorOffset));

        this.draw = function () {

            var F = getVectorFunctionValue(ptuX(this.x), ptuY(this.y));
            var velocityX = F[0] * pixelperBox * factor / 30;
            var velocityY = F[1] * pixelperBox * factor / 30;
            var speed = Math.sqrt(velocityX ** 2 + velocityY ** 2);

            if (isNaN(velocityX) || isNaN(velocityY)){
                this.respawn();
            }

            if (speed > MAXSPEED) {
                velocityX = velocityX / speed * MAXSPEED;
                velocityY = velocityY / speed * MAXSPEED;
            }

            if (particleAttributes.colorCodeWithAngle) {
                var angle = Math.atan2(velocityY, velocityX) * 180 / Math.PI;
                this.color = 'hsl(shade, 50%, 50%)'.replace('shade', parseInt(particleAttributes.colorOffset) + angle);
            }
            else if(particleAttributes.colorCodeWithSpeed){
                var speedColor = 720 / Math.PI * Math.atan(speed / 10);
                this.color = 'hsl(shade, 50%, 50%)'.replace('shade', parseInt(particleAttributes.colorOffset) + speedColor);
            }
            else{
                this.color = 'hsl(shade, 50%, 50%)'.replace('shade', parseInt(particleAttributes.colorOffset));
            }
            
            this.lifespan--;
            this.prevX = this.x;
            this.prevY = this.y;
            this.x += velocityX;
            this.y -= velocityY;

            c.beginPath();
            c.moveTo(this.prevX, this.prevY);
            c.lineTo(this.x, this.y);
            c.strokeStyle = this.color;
            c.lineWidth = this.widthModifier * particleAttributes.particleSize;
            c.lineCap = 'round';
            c.stroke();
        };

        this.respawn = function () {
            this.lifespan = Math.random() * 150;
            this.x = Math.random() * innerWidth;
            this.y = Math.random() * innerHeight;
        };
    }
}

class ArtificialParticle extends Particle{
    constructor(x, y){
        super(x, y);
        this.alive = false;

        this.spawn = function(){
            this.lifespan = Math.random() * 150;
            this.alive = true;

            this.x = mouse.x;
            this.y = mouse.y;
        }

        this.despawn = function(){
            this.alive = false;
        }
    }
}

class gridLine {
    constructor(start, end, alpha) {
        this.start = start;
        this.end = end;
        this.alpha = alpha;

        ctx.beginPath();
        ctx.moveTo(utpX(this.start[0]), utpY(this.start[1]));
        ctx.lineTo(utpX(this.end[0]), utpY(this.end[1]));
        ctx.strokeStyle = 'rgba(255, 255, 255, alpha)'.replace('alpha', this.alpha);
        ctx.stroke();
    }
}

class Vector {
    constructor(ctx, fromx, fromy, tox, toy) {

        this.dx = tox - fromx;
        this.dy = toy - fromy;
        this.angle = Math.atan2(this.dy, this.dx);
        this.length = Math.sqrt(this.dx ** 2 + this.dy ** 2) * vectorAttributes.vectorLength;

        if (this.length == 0 || this.length.isNaN) {
            ctx.moveTo(fromx + 1.5, fromy);
            ctx.arc(fromx, fromy, 3, 0, Math.PI * 2, true);
            return;
        }
        else if (normalizeVectorsCheck.checked) {
            this.length = 30 * vectorAttributes.vectorLength;
        }

        this.headRatio = 0.25;
        this.sideRatio = 0.1;
        this.sideLength = Math.min(this.sideRatio * this.length, 3);
        this.headLength = Math.min(this.headRatio * this.length, 20);
        this.bodyLength = this.length - this.headLength;

        this.tempArray = [
            [0, 0],
            [this.bodyLength, 0],
            [this.bodyLength, -this.sideLength],
            [this.length, 0],
            [this.bodyLength, this.sideLength],
            [this.bodyLength, 0]
        ];

        for (var i = 0; i < this.tempArray.length; i++) {
            this.tempArray[i] = rotate(this.tempArray[i][0], this.tempArray[i][1], this.angle);
            this.tempArray[i][0] += fromx;
            this.tempArray[i][1] += fromy;
        }

        ctx.moveTo(this.tempArray[0][0], this.tempArray[0][1]);
        for (var i = 1; i < this.tempArray.length; i++) {
            ctx.lineTo(this.tempArray[i][0], this.tempArray[i][1]);
        }
    }
}

var drawGrid = function() {
    ctx.font = "17px Computer Modern Serif";
    ctx.fillStyle = 'rgb(200, 200, 200)';
    ctx.textAlign = "center";

    var spacing = Math.round(5 * gridAttributes.spacing * 10 ** 10) / 10 ** 10;

    for (var i = ptuX(0) - ptuX(0) % gridAttributes.spacing; i < ptuX(innerWidth); i += gridAttributes.spacing) {
        var alpha = 0.2;
        i = Math.round(i * 10 ** 10) / 10 ** 10;
        if (i == 0) {
            alpha = 0.8;
            ctx.fillText(i, utpX(i) - 10, utpY(0) + 20);
        }
        else if (exactModulus(i, spacing) == 0) {
            alpha = 0.4;
            ctx.fillText(sciNotation(i, 10), utpX(i), utpY(0) + 20);
        }
        new gridLine([i, ptuY(0)], [i, ptuY(innerHeight)], alpha);
    }

    for (var i = ptuY(innerHeight) - ptuY(innerHeight) % gridAttributes.spacing; i < ptuY(0); i += gridAttributes.spacing) {
        var alpha = 0.2;
        i = Math.round(i * 10 ** 10) / 10 ** 10;
        if (i == 0)
            alpha = 0.8;
        else if (exactModulus(i, spacing) == 0) {
            alpha = 0.4;
            ctx.fillText(sciNotation(i, 10), utpX(0) - 10, utpY(i) + 5);
        }
        new gridLine([ptuX(0), i], [ptuX(innerWidth), i], alpha);
    }

}

var drawField = function(){
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, alpha)'.replace('alpha', 0.3);
    ctx.fillStyle = 'rgba(255, 255, 255, alpha)'.replace('alpha', 0.3);
    ctx.beginPath();

    var increment = vectorAttributes.vectorSpacing;
    var spacing = Math.round(increment * gridAttributes.spacing * 10 ** 10) / 10 ** 10;
    for(var i = ptuX(0) - ptuX(0) % gridAttributes.spacing - 5 * gridAttributes.spacing; i < ptuX(innerWidth) + 5 * gridAttributes.spacing; i += gridAttributes.spacing * Math.min(1, increment)){
        if(exactModulus(Math.round(i * 10 ** 10) / 10 ** 10, spacing) == 0 || Math.abs(i) < 10 ** -10){
            for(var j = ptuY(innerHeight) - ptuY(innerHeight) % gridAttributes.spacing - 5 * gridAttributes.spacing; j < ptuY(0) + 5 * gridAttributes.spacing; j += gridAttributes.spacing * Math.min(1, increment)){
                if(exactModulus(Math.round(j * 10 ** 10) / 10 ** 10, spacing) == 0 || Math.abs(j) < 10 ** -10){
                    var velocity = getVectorFunctionValue(Math.round(i * 10 ** 10) / 10 ** 10, Math.round(j * 10 ** 10) / 10 ** 10);
                    if(! isNaN(velocity[0]) && ! isNaN(velocity[1])){
                        new Vector(ctx, utpX(i), utpY(j), utpX(i + velocity[0]), utpY(j + velocity[1]));
                    }
                }
            }
        }
    }

    ctx.stroke();
    ctx.fill();
}

var refreshVector = function(){
    ctxv.clearRect(0, 0, innerWidth, innerHeight);

    ctxv.font = "17px Computer Modern Serif";
    ctxv.lineWidth = 3;
    ctxv.strokeStyle = 'rgb(200, 200, 200)';
    ctxv.fillStyle = 'rgb(200, 200, 200)';
    ctxv.textAlign = "center";
    ctxv.beginPath();

    var mousePos = [mouse.x, mouse.y];
    var unitPos = [ptuX(mouse.x), ptuY(mouse.y)];
    var velocity = getVectorFunctionValue(unitPos[0], unitPos[1]);

    ctxv.fillText(`F(${sciNotation(unitPos[0], 6)}, ${sciNotation(unitPos[1], 6)}) = <${sciNotation(velocity[0], 6)}, ${sciNotation(velocity[1], 6)}>`, mouse.x, mouse.y - 20);

    if(! isNaN(velocity[0]) && ! isNaN(velocity[1])){
        ctxv.arc(mousePos[0], mousePos[1], 4, 0, Math.PI * 2, true);
        new Vector(ctxv, mousePos[0], mousePos[1], utpX(unitPos[0] + velocity[0]), utpY(unitPos[1] + velocity[1]));
    }

    ctxv.stroke();
    ctxv.fill();

}

var refresh = function(){
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctxv.clearRect(0, 0, innerWidth, innerHeight);
    if(gridAttributes.show){
        drawGrid();
    }
    if(vectorAttributes.show){
        drawField();
    }
    if(vectorAttributes.showDetails && isInsideCanvas){
        refreshVector();
    }
}

var animate = function(){
    requestAnimationFrame(animate);

    c.fillStyle = "rgb(16, 20, 30, 0.05)";
    c.fillRect(0, 0, innerWidth, innerHeight);

    if(particleAttributes.show){
        for(var i = 0; i < particleAttributes.particleCount; i++){
            particle = particleArray[i];
            if(particle.x <= 0 || particle.x >= innerWidth|| 
                particle.y <= 0 || particle.y >= innerHeight||
                isNaN(particle.x) || isNaN(particle.y) ||
                particle.lifespan <= 0){
                particle.respawn();
            }
            particle.draw();
        }
    }

    if(artificialParticleAttributes.status){
        var index = artificialParticleAttributes.count % artificialParticleAttributes.maxCount;
        particleStream[index].spawn();
        artificialParticleAttributes.count++;
    }

    for(var i = 0; i < particleStream.length - 1; i++){
        particle = particleStream[i];
        if(particle.alive){
            if(particle.x <= 0 || particle.x >= innerWidth|| 
                particle.y <= 0 || particle.y >= innerHeight||
                particle.lifespan <= 0){
                particle.despawn();
            }
            particle.draw();
        }
    }

}



updateVectorFunction(defaultEquation[0], defaultEquation[1]);
CMSFont.load().then((font) => {
    document.fonts.add(font);
    refresh();
});

var particleArray = [];
var particleStream = [];
for(var i = 0; i < MAXCOUNT; i++){
    particleArray.push(new Particle(Math.random() * innerWidth, Math.random() * innerHeight));
}
for(var i = 0; i < 500; i++){
    particleStream.push(new ArtificialParticle(0, 0));
}

setTimeout(animate, 10);



