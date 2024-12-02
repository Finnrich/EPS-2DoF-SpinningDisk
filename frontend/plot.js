
const clrYourPath = getComputedStyle(document.body).getPropertyValue('--clr-yourPath');
const clrOptPath = getComputedStyle(document.body).getPropertyValue('--clr-optPath');
const dpr = window.devicePixelRatio || 1;
const sendDataInterval = 20;

// --- DISK DIAGRAM CENTER --- //

const diskC = document.querySelector("#disk-diagram-cont > canvas");
const diskDiagram = new DiskDiagram(diskC, 500, 100);

const optPath = [
    76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76,
    76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76,
    83, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90,
    90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90,
    90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90,
    90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90,
    90, 90, 83, 76, 76, 76, 76, 76, 76, 76, 76, 76,
    76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76,
    76, 76, 76, 76
  ];
const optPathWidth = [
    11,  3,  4,  6,  5, 12, 14,  5, 12,  5,  2, 14,
    12,  6,  7, 14, 11,  3, 14,  9, 14,  1,  9, 14,
     9, 14,  7, 13,  9,  3, 15, 14, 13,  3,  2, 15,
     3,  4, 14,  7,  7, 15,  2,  4,  5,  7,  7, 15,
     3, 15, 15, 11,  8, 14,  2,  5,  5,  1,  4,  4,
     6,  7,  5,  7,  2, 15, 15,  2,  6, 15, 10,  1,
    12,  5, 15,  4, 12, 14,  1, 14,  6, 11,  2,  1,
     3, 12,  6, 13,  7,  9,  6, 12, 12,  3,  7,  5,
     7, 10,  3, 13
  ];
diskDiagram.setOptPath(optPath, optPathWidth);

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
        offsetDiagram.addPoint(diskDiagram.getCurOffset());
        offsetDiagram.render();
        if (intervalCount%5==0) {
            const evaluation = diskDiagram.getEvaluationAvg();
            evalEl.innerText = evaluation;
            evalProgbarFillEl.style.width = evaluation + '%';
        }
        intervalCount++;
    }
    // console.log(new Date().getMilliseconds());
}, sendDataInterval);

// --------------------------- //

// --- LINEAR DIAGRAMS --- //

const linPosC = document.querySelector("#sensor-linear-position > canvas");
const linearPosValue = document.getElementById('linear-position-value');
const offsetC = document.querySelector("#sensor-offset > canvas");
const offsetValue = document.getElementById('offset-value');
const linPosToOptC = document.getElementById("lin-pos-to-opt");
const sensorPoints = 100;
const sensorMaxValue = 100;

linPosDiagram = new LinearDiagram(linPosC, clrYourPath);
linPosDiagram.setValueDisplayEl(linearPosValue);
offsetDiagram = new LinearDiagram(offsetC, clrOptPath, -100, 100);
offsetDiagram.setValueDisplayEl(offsetValue);
linPosToOptDiagram = new LinearDiagram(linPosToOptC);