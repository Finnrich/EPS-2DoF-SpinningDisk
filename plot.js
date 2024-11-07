
// --- DISK DIAGRAM CENTER --- //

const clrYoutPath = getComputedStyle(document.body).getPropertyValue('--clr-yourPath'); 

const diskC = document.querySelector("#disk-diagram-cont > canvas");
const diskCtx = diskC.getContext("2d");
const pointsPerRev = 100;
const diskMaxValue = 100;
const dpr = window.devicePixelRatio || 1;

let diskValues = [];
let diskPoints = [];


function diskSetSize() {
    const w = diskC.offsetWidth * dpr + "px";
    console.log(w);
    
    diskC.setAttribute("width", w);
    diskC.setAttribute("height", w);
}

function diskDrawNextPoint(v) {
    diskCtx.clearRect(0, 0, diskC.width, diskC.height);

    diskValues.push(v);
    diskPoints.push(v2Circle(v, (diskValues.length-1)/pointsPerRev));

    diskCtx.beginPath();
    for(let i=0; i<diskPoints.length; i++) {
        if (diskPoints.length > 1) {
            // console.log("drawing", diskPoints[i][0], diskPoints[i][1]);
            
            diskCtx.lineTo(diskPoints[i][0], diskPoints[i][1]);
            diskCtx.strokeStyle = clrYoutPath;
            diskCtx.lineWidth = 3;
            diskCtx.stroke();
        }
        diskCtx.moveTo(diskPoints[i][0], diskPoints[i][1]);
    }
    diskCtx.stroke();
}

// convert single value to point on circle (0 <= progress >= 1)
function v2Circle(v, progress) {
    v = v/diskMaxValue*diskC.width/2;
    progress *= Math.PI*2;
    x = Math.cos(progress);
    y = Math.sin(progress);
    x *= v;
    y *= v;
    x += diskC.width/2;
    y += diskC.height/2;
    return [x, y];
}

const testDataPoints = [60,67.42211877763569,74.38276615812609,80.44916280070002,85.2441295442369,88.46953858066759,89.92484959812163,89.5195784062181,87.27892280477045,83.34219590663764,77.95416432311869,71.44982976156994,64.23360024179601,56.75414596409675,49.47650316931141,42.853160437729684,37.29592514076215,33.1503192531425,30.67409647004709,30.02121633073866,31.232271760105846,34.23196519720224,38.83379023288824,44.75162767502225,51.617535054032224,59.0046235035733,66.45359964263446,73.50132221341853,79.70959796156367,84.69242637034516,88.13999930324216,89.83796337333528,89.68074739870146,87.67812630718021,83.9546133787047,78.74171861262577,72.3635545572527,65.216684561413,57.74546638614572,50.41442419133179,43.67936667331891,37.959047087856135,33.6091272008499,30.900063962379644,30.000293803478897,30.965760074662157,33.73643475934715,38.1400507251849,43.90281245998695,50.66641935056618,58.01034307946398,65.47797403893402,72.60501110479923,78.94832963154715,84.11353279654863,87.77947328425881,89.71822067084611,89.80923303398288,88.04685166574049,84.54065290364082,79.5086352047135,73.26366505729618,66.1940244581339,58.73926941843477,51.36290050004804,44.52354459545672,38.64643972892631,34.09699581576283,31.158075243613297,30.012405859223485,30.731219835955272,33.2698248022544,37.47038259684972,43.07172288114434,49.72558144591162,57.01825359303456,64.49631628988857,71.69481981739136,78.16619609158803,83.50808627935066,87.38835752182882,89.56575334695358,89.90489382836398,88.38469285352612,85.09966915608169,80.25406959878403,74.14917009282588,67.16454372088748,59.73446072128788,52.320887667920005,45.38476462618471,39.357346132251095,34.61338787474488,31.447846201129394,30.057539160618113,30.528909311147302,32.83264913980129,36.82552326201689,42.25927410404627,48.79605735647656];
let curI = 0;

diskSetSize();
feedDataPoint();
function feedDataPoint() {
    // for (let i=0; i<pointsPerRev; i++) {
    //     diskDrawNextPoint(testDataPoints[i]);
    // }
    setTimeout(() => {
        
        if (curI < pointsPerRev) {
            diskDrawNextPoint(testDataPoints[curI]);
            curI++;
            feedDataPoint();
        }
    }, 10);
}

// --------------------------- //