const dbEl = document.getElementById('debug');
const mCEl = document.getElementById('msgCount');
let msgCount = 0;

if ("serial" in navigator) {
    // The Web Serial API is supported.
    document.getElementById('connect').addEventListener('click', async () => {
        sC = new SerialController(9600);
        await sC.init();
        while (true) {
            const {value, done} = await sC.listen();
            if (done) {
                break;
            }
            dbEl.innerText = value;
            msgCount++;
            mCEl.innerText = msgCount;
        }
    });

} else {
    dbEl.innerText = "This browser doesn't support serial connection. Use Chrome or another Chromium-based browser.";
    dbEl.classList.remove('hidden');
}