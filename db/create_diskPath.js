/*

Create disk path data with this script

1. Measure the radius of the disk and insert the value into diskRadius.

2. Measure the different distances from the center of the disk:
    For every distance insert an object into data with the structure:
        { val, len, trans }
         val: Distance from center of disk
         len: How long until the next data point (%, so 0.5 if it takes 180° => sum should be 1)
         trans: How to transition to the next data point (STEP / LINEAR)

3. Run the script with node or in the console of a browser.

4. Insert the result into the database table 2dof_disks with the disk code.

*/

// Transition types (dont change)
const STEP = 0 // Instant transition at end
const LINEAR = 1 // Linear transition between values



// ---------------------- //
// Change these variables //

let pointCount = 300; // Number of data points in result
let diskRadius = 125; // Radius of disk (used to normalize)
let width = 10;       // Width of the path (global)

let data = [
    {
        val: 95,
        len: 0.25,
        trans: STEP
    },
    {
        val: 104.95,
        len: 0.5,
        trans: STEP
    },
    {
        val: 95,
        len: 0.25,
        trans: STEP
    }
];

// ---------------------- //



let p = []; // Will include path data

// util
function normVal(v) {
    v = v / (diskRadius/100); // normalize
    v = Math.round((v + Number.EPSILON) * 1000) / 1000; // Round to 3 decimals (ensure correct rounding with epsilon)
    return v;
}

for (let i=0; i<data.length; i++) {
    for (let j=0; j<(pointCount*data[i].len); j++) {
        switch (data[i].trans) {

            case STEP:
                p.push(normVal(data[i].val));
                break;
            
            case LINEAR:
                const dataVal = data[i].val;
                const nextDataVal = i < data.length-1 ? data[i+1].val : data[0].val; // transition to first value if this is the last
                const val = dataVal + (nextDataVal - dataVal) * (j / (pointCount * data[i].len));
                p.push(normVal(val));
                break;
        }
    }
}

const output = {
    width: width,
    path: p
};

console.log(JSON.stringify(output));