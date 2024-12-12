import { dpr } from "../variables/values";

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

export default Diagram;