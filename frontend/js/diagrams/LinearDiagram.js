import Diagram from "./Diagram";

import { clrBG, clrButton } from "../variables/values";

// LinearDiagram displays one or more values as a diagram
// Values are added with addDiagramValue with its config

class LinearDiagram extends Diagram {
    static allLinearDiagrams = [];

    constructor(canvas) {
        super(canvas, false);
        this.generateBG();
        LinearDiagram.allLinearDiagrams.push(this);
        this.diagrams = [];
    }

    // add a new value to the diagram
    // valDisplayEl is a HTML element that displays the raw value (can be undefined)
    addDiagramValue(color, valDisplayEl, minValue=0, maxValue=100, pointsCount=100) {
        this.diagrams.push({
            color: color,
            minValue: minValue,
            maxValue: maxValue,
            valueRange: maxValue - minValue,
            pointsCount: pointsCount,
            points: [],
            valDisplayEl: valDisplayEl
        });
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
        for (let i=0; i<this.diagrams.length; i++) {
            const diagram = this.diagrams[i];
            this.ctx.beginPath();
            for(let i=0; i<diagram.points.length; i++) {
                const x = this.canvas.width-(i/diagram.pointsCount)*this.canvas.width; // draw from the right
                const y = -2+this.canvas.height-((diagram.points[diagram.points.length-i-1]-diagram.minValue)/diagram.valueRange)*(this.canvas.height-4);
                this.ctx.lineTo(x, y); // draw last point first
            }
            this.ctx.strokeStyle = diagram.color;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            if (diagram.valDisplayEl) {
                diagram.valDisplayEl.innerText = diagram.points[diagram.points.length-1] || 0;
            }
        }
    }

    // add the next value(s)
    // can be a single number if only one value is displayed in the diagram
    // otherwise this has to be an array of numbers with the same length as
    // values added to the diagram in the same order as added
    addPoint(vArr) {
        if (typeof vArr !== 'object') {
            // not an array
            vArr = [vArr];
        }
        if (vArr.length != this.diagrams.length) {
            return;
        }
        for (let i=0; i<this.diagrams.length; i++) {
            const diagram = this.diagrams[i];
            diagram.points.push(vArr[i]);
            while (diagram.points.length > diagram.pointsCount+1) {
                diagram.points.shift();
            }
        }
    }

    // rerenders all LinearDiagrams (for light/dark mode change)
    static ldModeChange() {
        this.allLinearDiagrams.forEach(ld => {
            ld.generateBG();
            ld.render();
        });
    }
}

export default LinearDiagram;