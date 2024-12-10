import DiskDiagram from "./diagrams/DiskDiagram";
import LinearDiagram from "./diagrams/LinearDiagram";

import { manualMode } from "./main";
import { clrYourPath, clrOptPath, sendDataInterval } from "./values";

// --- DISK DIAGRAM CENTER --- //

const diskC = document.querySelector("#disk-diagram-cont > canvas");
export const diskDiagram = new DiskDiagram(diskC, 500, 100);

const evalEl = document.getElementById('points-num');
const evalProgbarFillEl = document.getElementById('eval-progbar-fill');
const manualInput = document.getElementById('range-linear-motor');

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
            evalProgbarFillEl.style.setProperty('--eval', evaluation + '%');
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

const linPosDiagram = new LinearDiagram(linPosC, clrYourPath);
linPosDiagram.setValueDisplayEl(linearPosValue);
const vertDistDiagram = new LinearDiagram(vertDistC, clrOptPath, -100, 100);
vertDistDiagram.setValueDisplayEl(vertDistValue);
const linPosToOptDiagram = new LinearDiagram(linPosToOptC);