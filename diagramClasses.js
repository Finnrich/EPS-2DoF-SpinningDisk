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

class DiskDiagram extends Diagram {
    constructor(canvas, pointsPerRev=100, maxValue=100) {
        super(canvas);
        this.pointsPerRev = pointsPerRev;
        this.maxValue = maxValue;
        this.values = [];
        this.progresses = [];
        this.points = [];
        this.progress = 0;
        this.minOneRep = false;
    }
    
    drawNextAndAllPoints(v) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawOptPathImg();
    
        this.values.push(v);

        if (this.minOneRep) {
            this.truncateValuesAndPoints();
        }
        
        this.progresses.push(this.progress);
        this.points.push(this.v2Circle(v, this.progress));
        this.progress += 1/this.pointsPerRev;
        if (this.progress >= 1) {
            this.progress -= 1;
            this.minOneRep = true;
        }
    
        this.ctx.beginPath();
        if (this.points.length > 1) {
            for(let i=0; i<this.points.length; i++) {
                this.ctx.lineTo(this.points[i][0], this.points[i][1]);
            }
        } else {
            this.ctx.moveTo(this.points[0][0], this.points[0][1]);
        }
    
        this.ctx.strokeStyle = clrYourPath;
        this.ctx.lineWidth = 5;
        this.ctx.stroke();
    }
    
    // not currently used
    drawNextPoint(v) {
        this.values.push(v);
        
        this.points.push(this.v2Circle(v, this.progress));
        this.progress += 1/this.pointsPerRev;
        this.progress -= this.progress > 1 ? 1 : 0;
        const i = this.points.length-1;
    
        if (i > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.points[i-1][0], this.points[i-1][1]);
            this.ctx.lineTo(this.points[i][0], this.points[i][1]);
            this.ctx.strokeStyle = clrYourPath;
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
        }
    }

    truncateValuesAndPoints() {
        let dist = this.progress-this.progresses[0];
        
        while ((this.progresses[0] <= this.progress && dist < 0.5) || dist < -0.5 || (dist > -0.01 && dist < 0)) {
            this.values.shift();
            this.points.shift();
            this.progresses.shift();
            dist = this.progress-this.progresses[0];
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

    setOptPath(optPath) {
        this.optPathData = optPath;
        this.generateOptPathImg();
        this.drawOptPathImg();
    }

    generateOptPathImg() {
        const offscreenOptPath = new OffscreenCanvas(this.canvas.width, this.canvas.height);
        const oopCtx = offscreenOptPath.getContext("2d");
        oopCtx.beginPath();
        const startPoint = this.v2Circle(this.optPathData[0], 0);
        
        oopCtx.moveTo(startPoint[0], startPoint[1]);
        for(let i=1; i<this.optPathData.length; i++) {
            const point = this.v2Circle(this.optPathData[i], i/this.optPathData.length);
            oopCtx.lineTo(point[0], point[1]);
        }
        oopCtx.closePath();
        oopCtx.strokeStyle = clrOptPath;
        oopCtx.lineWidth = 10;
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
}

class LinearDiagram extends Diagram {
    static allLinearDiagrams = [];

    constructor(canvas, color, pointsCount=100, maxValue=100) {
        super(canvas, false);
        this.generateBG();
        LinearDiagram.allLinearDiagrams.push(this);
        this.pointsCount = pointsCount;
        this.maxValue = maxValue;
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
            const y = -2+this.canvas.height-(this.points[this.points.length-i-1]/this.maxValue)*(this.canvas.height-4);
            this.ctx.lineTo(x, y); // draw last point first
        }
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    addPoint(v) {
        this.points.push(v);
        while (this.points.length > this.pointsCount+1) {
            this.points.shift();
        }
    }

    static ldModeChange() {
        this.allLinearDiagrams.forEach(ld => {
            ld.generateBG();
            ld.render();
        });
    }
}