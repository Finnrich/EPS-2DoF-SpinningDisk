class DiskDataPoint {
    constructor(value, progress, vector) {
        this.val = value;
        this.prog = progress;
        this.pos = {x: vector[0], y: vector[1]};
    }
}

export default DiskDataPoint;