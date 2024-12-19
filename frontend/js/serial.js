import SerialController from "./libs/webserial";
import { feedValue } from "./plot";

const dbEl = document.getElementById('debug');
let sC;

if ("serial" in navigator) {
    // The Web Serial API is supported.
    document.getElementById('connect').addEventListener('click', async () => {
        sC = new SerialController(115000);
        await sC.init();
        while (true) {
            const {value, done} = await sC.listen();
            if (done) {
                break;
            }
            console.log(value);
            let json;
            try {
                // const idx = value.indexOf('}');
                // v = value.substring(0, idx+1);
                // json = JSON.parse(v);
                json = JSON.parse(value);
                // console.log(json);
                feedValue(parseInt(json.angle), parseInt(json.measured));
            } catch {
                console.log('JSON Err');
            }
        }
    });

} else {
    dbEl.innerText = "This browser doesn't support serial connection. Use Chrome or another Chromium-based browser.";
    dbEl.classList.remove('hidden');
}

export function sendInitialSetPoint(v) {
    setInterval(() => {
        const linearInput = document.getElementById('range-linear-motor');
        const json = JSON.stringify({
            setpoint: linearInput.value
        });
        // console.log(json);
        sC.write(json);
    }, 400);
}

// window.sendPhysical = sendPhysical;
// function sendPhysical() {
//     const json = '{ "setpoint": ' + 150 + '}';
//     console.log(json);
//     sC.write(json);
// }