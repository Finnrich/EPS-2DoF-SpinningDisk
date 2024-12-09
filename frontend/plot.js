
const clrYourPath = getComputedStyle(document.body).getPropertyValue('--clr-yourPath');
const clrOptPath = getComputedStyle(document.body).getPropertyValue('--clr-optPath');
const dpr = window.devicePixelRatio || 1;
const sendDataInterval = 20;

// --- DISK DIAGRAM CENTER --- //

const diskC = document.querySelector("#disk-diagram-cont > canvas");
const diskDiagram = new DiskDiagram(diskC, 500, 100);

var optPath;
const optPathWidth = 5;

const evalEl = document.getElementById('points-num');
const evalProgbarFillEl = document.getElementById('eval-progbar-fill');

// feedDataPoint();
// function feedDataPoint() {
//     // for (let i=0; i<pointsPerRev; i++) {
//     //     diskDrawNextPoint(testDataPoints[i]);
//     // }
// }
let intervalCount = 0;
setInterval(() => {
    if (manualMode) {
        diskDiagram.drawNextAndAllPoints(manualInput.value);
        linPosDiagram.addPoint(manualInput.value);
        linPosDiagram.render();
        vertDistDiagram.addPoint(diskDiagram.getCurOffset());
        vertDistDiagram.render();
        if (intervalCount%5==0) {
            const evaluation = diskDiagram.getEvaluationAvg();
            evalEl.innerText = evaluation;
            evalProgbarFillEl.style.width = evaluation + '%';
        }
        intervalCount++;
    }
}, sendDataInterval);

// --------------------------- //

// --- LINEAR DIAGRAMS --- //

const linPosC = document.querySelector("#sensor-linear-position > canvas");
const linearPosValue = document.getElementById('linear-position-value');
const vertDistC = document.querySelector("#sensor-vertDist > canvas");
const vertDistValue = document.getElementById('vertDist-value');
const linPosToOptC = document.getElementById("lin-pos-to-opt");
const sensorPoints = 100;
const sensorMaxValue = 100;

linPosDiagram = new LinearDiagram(linPosC, clrYourPath);
linPosDiagram.setValueDisplayEl(linearPosValue);
vertDistDiagram = new LinearDiagram(vertDistC, clrOptPath, -100, 100);
vertDistDiagram.setValueDisplayEl(vertDistValue);
linPosToOptDiagram = new LinearDiagram(linPosToOptC);