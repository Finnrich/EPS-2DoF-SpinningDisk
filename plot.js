
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
diskDiagram.setOptPath(optPath);

// feedDataPoint();
// function feedDataPoint() {
//     // for (let i=0; i<pointsPerRev; i++) {
//     //     diskDrawNextPoint(testDataPoints[i]);
//     // }
// }
setInterval(() => {
    if (manualMode) {
        diskDiagram.drawNextAndAllPoints(manualInput.value);
        linPosDiagram.addPoint(manualInput.value);
        linPosDiagram.render();
    }
    // console.log(new Date().getMilliseconds());
}, sendDataInterval);

// --------------------------- //

// --- LINEAR DIAGRAMS --- //

const linPosC = document.querySelector("#sensor-linear-position > canvas");
const offsetC = document.querySelector("#sensor-offset > canvas");
const linPosToOptC = document.getElementById("lin-pos-to-opt");
const sensorPoints = 100;
const sensorMaxValue = 100;

linPosDiagram = new LinearDiagram(linPosC, clrYourPath);
offsetDiagram = new LinearDiagram(offsetC, clrOptPath);
linPosToOptDiagram = new LinearDiagram(linPosToOptC);