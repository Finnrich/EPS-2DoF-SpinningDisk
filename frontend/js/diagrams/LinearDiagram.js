import Diagram from "./Diagram";

import { clrBG, clrButton } from "../values";

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

export default LinearDiagram;