class Diagram {
    constructor(canvas, alpha=true) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d", { alpha: alpha });
        this.setCanvasSize();
    }

    setCanvasSize() {
        const w = this.canvas.offsetWidth * dpr + "px";
        const h = this.canvas.offsetHeight * dpr + "px";
        this.canvas.setAttribute("width", w);
        this.canvas.setAttribute("height", h);
    }
}

class DiskDataPoint {
    constructor(value, progress, vector) {
        this.val = value;
        this.prog = progress;
        this.pos = {x: vector[0], y: vector[1]};
    }
}

class DiskDiagram extends Diagram {

    static evalGroupsCount = 100; // Evaluation groups values, so that the average is still representative if the point density changes

    constructor(canvas, pointsPerRev=100, maxValue=100) {
        super(canvas);
        this.pointsPerRev = pointsPerRev;
        this.maxValue = maxValue;
        this.dataPoints = [];
        this.values = [];
        this.progresses = [];
        this.points = [];
        this.evaluations = [];
        this.progessStartIdx = 0; // first index of dataPoints after progress start
        this.progress = 0;
        this.minOneRep = false;
    }
    
    drawNextAndAllPoints(v) {
        v = parseFloat(v);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawOptPathImg();

        if (this.minOneRep) {
            this.truncateValuesAndPoints();
        }
        
        this.dataPoints.push(new DiskDataPoint(v, this.progress, this.v2Circle(v, this.progress)));
        this.progress += 1/this.pointsPerRev;
        if (this.progress >= 1) {
            this.progress -= 1;
            this.progessStartIdx = this.dataPoints.length-1;
            this.minOneRep = true;
        }
    
        this.ctx.beginPath();
        if (this.dataPoints.length > 1) {
            for(let i=0; i<this.dataPoints.length; i++) {
                this.ctx.lineTo(this.dataPoints[i].pos.x, this.dataPoints[i].pos.y);
            }
        } else {
            this.ctx.moveTo(this.dataPoints[0].pos.x, this.dataPoints[0].pos.y);
        }
    
        this.ctx.strokeStyle = clrYourPath;
        this.ctx.lineWidth = 5;
        this.ctx.stroke();
    }

    truncateValuesAndPoints() {
        let dist = this.progress-this.dataPoints[0].prog;
        
        // remove all previous data points that overlap
        while ((this.dataPoints[0].prog <= this.progress && dist < 0.5) || dist < -0.5 || (dist > -0.01 && dist < 0)) {
            this.dataPoints.shift();
            this.progessStartIdx -= this.progessStartIdx == 0 ? 0 : 1;
            dist = this.progress-this.dataPoints[0].prog;
        }
    }
    
    // convert single value to point on circle (0 <= progress >= 1)
    v2Circle(v, progress) {
        v = v/this.maxValue*(this.canvas.width/2-3);
        progress *= Math.PI*2;
        let x = Math.cos(progress);
        let y = Math.sin(progress);
        x *= v;
        y *= v;
        x += this.canvas.width/2;
        y += this.canvas.height/2;
        // x = Math.floor(x); // can be used for optimizing performance (no anti-aliasing needed)
        // y = Math.floor(y);
        return [x, y];
    }

    // used to define the optimal path
    // optPathWidth can be empty array, array of the same length as optPathData or a number
    //   empty array means everywhere 1 pixel width
    //   single number means everywhere n pixels width
    //   array defines width at every datapoint of optPathData seperately
    setOptPath(optPath, optPathWidth = []) {
        this.optPathData = optPath;
        this.optPathWidth = [];
        if (typeof optPathWidth === "object") {
            if (optPathWidth.length == optPath.length) { // filled array
                this.optPathWidth = optPathWidth;
            } else if (optPathWidth == []) { // empty array
                for(let i=0; i<optPath.length; i++) {
                    this.optPathWidth.push(1);
                }
            }
        } else if (typeof optPathWidth === "number") { // number
            for(let i=0; i<optPath.length; i++) {
                this.optPathWidth.push(optPathWidth);
            }
        }
        this.generateOptPathImg();
        this.drawOptPathImg();
    }

    generateOptPathImg() {
        const offscreenOptPath = new OffscreenCanvas(this.canvas.width, this.canvas.height);
        const oopCtx = offscreenOptPath.getContext("2d");
        // oopCtx.beginPath();
        const startPoint = this.v2Circle(this.optPathData[0], 0);
        // oopCtx.beginPath();
        
        // oopCtx.moveTo(startPoint[0], startPoint[1]);
        for(let i=1; i<this.optPathData.length; i++) {
            // const prevPoint = this.v2Circle(this.optPathData[i-1], (i-1)/this.optPathData.length);
            // oopCtx.moveTo(prevPoint[0], prevPoint[1]);
            const point = this.v2Circle(this.optPathData[i], i/this.optPathData.length);
            // oopCtx.strokeStyle = clrOptPath;
            // oopCtx.lineWidth = this.optPathWidth[i];
            oopCtx.lineTo(point[0], point[1]);
            // oopCtx.stroke();
        }
        oopCtx.strokeStyle = clrOptPath;
        oopCtx.lineWidth = 10;
        oopCtx.closePath();
        oopCtx.stroke();

        this.optPathImg = offscreenOptPath;
    }

    drawOptPathImg() {
        if (this.optPathImg) {
            this.ctx.drawImage(
                this.optPathImg,
                0, 0, this.canvas.width, this.canvas.height
            );
        }
    }

    changeSpeed(ppr) {
        this.pointsPerRev = ppr;
    }

    evaluateValue(v, prog) {
        const pathValue = this.getPathValueAtProgress(prog);
        if (pathValue === false) {
            return false;
        }
        const dist = Math.abs(v-pathValue); // distance of opt value to nearest path value
        const e = dist == 0 ? 1 : 1/Math.pow(dist, 2); // 1/x^2
        return e > 0.01 ? e : 0; // if under 1% return 0%
    }

    getPathValueAtProgress(progress) { // get value of yourPath at progess (interpolated if not exact match at progress)
        let idxNearest = Math.floor(this.dataPoints.length * progress); // guess position of progress value (should be roughly correct if dataPoints is full and equally spaced)
        const firstGuessProg = this.dataPoints[this.sortedIdx2Real(idxNearest)].prog; // progress of first guess
        let curProgDist = this.distProg2Prog(progress, firstGuessProg); // distance of current guess to real progress
        const dir = firstGuessProg > progress ? -1 : 1; // direction of search
        let found = false;
        while (!found) { // search real nearest progress
            const compIdx = idxNearest+dir;
            const compProg = this.dataPoints[this.sortedIdx2Real(compIdx)].prog;
            const compProgDist = this.distProg2Prog(progress, compProg);
            if (curProgDist > compProgDist) {
                curProgDist = compProgDist;
                idxNearest = compIdx;
            } else {
                found = true;
            }
        }
        if (curProgDist > 1/this.optPathData.length) {
            return false; // no representative value (too far away)
        }

        const progNearest = this.dataPoints[this.sortedIdx2Real(idxNearest)].prog; // progress of chosen value in optPath
        const valNearest = this.dataPoints[this.sortedIdx2Real(idxNearest)].val;
        const idxSecNearest = progress > progNearest ? idxNearest+1 : idxNearest-1; // get second nearest value in optPathData to interpolate between to get more precise value
        let interpValue = valNearest;
        if (this.dataPoints[this.sortedIdx2Real(idxSecNearest)]) {
            const progSecNearest = this.dataPoints[this.sortedIdx2Real(idxSecNearest)].prog; // progress of second nearest
            const valSecNearest = this.dataPoints[this.sortedIdx2Real(idxSecNearest)].val;
            const progBtwNearests = (progress-progSecNearest)/(progNearest-progSecNearest); // where is real progress between nearest and second nearest optPath (0-1)
            interpValue = valNearest*progBtwNearests + valSecNearest*(1-progBtwNearests);
        }
        return Math.round(interpValue);
    }

    getOptValueAtProgress(progress) {
        const idxNearest = Math.floor(this.optPathData.length * progress);
        const valNearest = this.optPathData[idxNearest];
        const progNearest = idxNearest/this.optPathData.length;
        const dir = progNearest > progress ? -1 : 1;
        const idxSecNearest = idxNearest + dir;
        const valSecNearest = this.optPathData[idxSecNearest];
        const progSecNearest = idxSecNearest/this.optPathData.length;
        const progBtwNearests = (progress-progSecNearest)/(progNearest-progSecNearest);
        const interpValue = valNearest*progBtwNearests + valSecNearest*(1-progBtwNearests);
        return Math.round(interpValue);
    }

    getCurOffset() {
        const curValue = this.dataPoints[this.dataPoints.length-1].val;
        const optValue = this.getOptValueAtProgress(this.progress);
        return optValue - curValue;
    }

    // getEvaluationAvg() {
    //     const startProg = this.dataPoints[0].prog;
    //     let sum = 0;
    //     let idx = 0;
    //     let skipped = 0;
    //     for (let i=0; i<DiskDiagram.evalGroupsCount; i++) {
    //         if (this.dataPoints[idx]) {
    //             const subStartProg = startProg+1/DiskDiagram.evalGroupsCount*i;
    //             let subsum = 0;
    //             let j = 0;
    //             while (this.dataPoints[idx+j] && this.isWithinEvalGroup(subStartProg, this.dataPoints[idx+j].prog)) {
    //                 subsum += this.evaluateValue(this.dataPoints[idx+j].val, this.dataPoints[idx+j].prog);
    //                 j++;
    //             }
    //             idx += j;
    //             if (j != 0) {
    //                 sum += subsum/j;
    //             }
    //         }
    //     }
    //     sum = sum/this.optPathData.length*100;
    //     return Math.round(sum*100)/100; // average rounded to max two decimals
    // }

    getEvaluationAvg() {
        let sum = 0;
        let skipped = 0;
        if (this.dataPoints.length != 0) {
            for (let i=0; i<this.optPathData.length; i++) {
                const evalVal = this.evaluateValue(this.optPathData[i], i/this.optPathData.length);
                if (evalVal !== false) {
                    sum += evalVal;
                } else if (this.minOneRep) {
                    skipped++;
                }
            }
        }
        sum = sum/(this.optPathData.length-skipped)*100;
        return Math.round(sum*100)/100; // average rounded to max two decimals
    }

    sortedIdx2Real(i) {
        i = this.progessStartIdx + i;
        return i - (Math.floor(i/this.dataPoints.length)*this.dataPoints.length);
    }

    distProg2Prog(p1, p2) {
        const normalDist = Math.abs(p1-p2);
        const over0Dist = (p1>0.5 ? 1-p1+p2 : 1-p2+p1); // measures distance if crossing over 0 point of circle
        return normalDist < over0Dist ? normalDist : over0Dist; // return the shorter distance method
    }
}

class LinearDiagram extends Diagram {
    static allLinearDiagrams = [];

    constructor(canvas, color, minValue=0, maxValue=100, pointsCount=100) {
        super(canvas, false);
        this.generateBG();
        LinearDiagram.allLinearDiagrams.push(this);
        this.pointsCount = pointsCount;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.valueRange = maxValue-minValue;
        this.points = [];
        this.color = color;
    }

    // generate diagram background in offscreen canvas
    generateBG() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const sensorBG = new OffscreenCanvas(w, h);
        const sensorBGCtx = sensorBG.getContext("2d", { alpha: false });
        sensorBGCtx.rect(0, 0, w, h);
        sensorBGCtx.fillStyle = clrBG;
        sensorBGCtx.fill();
        sensorBGCtx.moveTo(0, h/2);
        sensorBGCtx.lineTo(w, h/2);
        sensorBGCtx.strokeStyle = clrButton;
        sensorBGCtx.lineWidth = 1;
        sensorBGCtx.stroke();
        this.bg = sensorBG;
        this.drawBG();
    }

    drawBG() {
        this.ctx.drawImage(this.bg, 0, 0, this.canvas.width, this.canvas.height);
    }

    render() {
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
        this.drawBG();
        this.ctx.beginPath();
        for(let i=0; i<this.points.length; i++) {
            const x = this.canvas.width-(i/this.pointsCount)*this.canvas.width; // draw from the right
            const y = -2+this.canvas.height-((this.points[this.points.length-i-1]-this.minValue)/this.valueRange)*(this.canvas.height-4);
            this.ctx.lineTo(x, y); // draw last point first
        }
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        if (this.valDisplayEl) {
            console.log(this.points[0]);
            this.valDisplayEl.innerText = this.points[this.points.length-1];
        }
    }

    addPoint(v) {
        this.points.push(v);
        while (this.points.length > this.pointsCount+1) {
            this.points.shift();
        }
    }

    setValueDisplayEl(el) {
        this.valDisplayEl = el;
    }

    static ldModeChange() {
        this.allLinearDiagrams.forEach(ld => {
            ld.generateBG();
            ld.render();
        });
    }
}