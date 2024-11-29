var clrBG = getComputedStyle(document.body).getPropertyValue('--lmBG');
var clrButton = getComputedStyle(document.body).getPropertyValue('--lmButton');

// ------------------------------- //
// ------- LIGHT-DARK MODE ------- //
// ------------------------------- //

changeLDMode(getCookie("ldMode") == "0" ? false : true); // check+set light/dark mode from cookies
setTimeout(() => { // prevent onreload flashing to default light mode
    document.querySelector('html').setAttribute('done', 'true');
}, 50);

// change light/dark mode (onclick)
function changeLDMode(isLightmode) { // boolean -> 1: light, 0: dark
    const selecEl = document.getElementById('ld-modes-selection');
    const root = document.querySelector(':root');
    if (isLightmode) {
        if (selecEl.getAttribute('mode') != 'light') {
            root.style.setProperty("color-scheme", "light");
            selecEl.setAttribute('mode', 'light');
            setCookie("ldMode", "1");
            clrBG = getComputedStyle(document.body).getPropertyValue('--lmBG');
            clrButton = getComputedStyle(document.body).getPropertyValue('--lmButton');
        }
    } else {
        if (selecEl.getAttribute('mode') != 'dark') {
            root.style.setProperty("color-scheme", "dark");
            selecEl.setAttribute('mode', 'dark');
            setCookie("ldMode", "0");
            clrBG = getComputedStyle(document.body).getPropertyValue('--dmBG');
            clrButton = getComputedStyle(document.body).getPropertyValue('--dmButton');
        }
    }
    LinearDiagram.ldModeChange();
}


// ------------------------------- //
// ----------- BUTTONS ----------- //
// ------------------------------- //

// Manual Mode
// Toggle Manual Mode
var manualMode = false;
function toggleManualMode() {
    const mmCont = document.getElementById('manual-mode');
    const mmInputs = mmCont.querySelector('.inputs-cont');
    const mmButton = document.getElementById('activate-manual-mode');

    if (mmCont.classList.contains('disabled')) {
        // When algorithm is running
        console.error("Manual mode cannot be turned on right now");
    } else if (mmInputs.classList.contains('disabled')) {
        // Manual mode is currently off
        manualMode = true;
        mmInputs.classList.remove('disabled');
        mmButton.innerText = 'Disable Manual Mode';
    } else {
        // Manual mode is currently on
        manualMode = false;
        mmInputs.classList.add('disabled');
        mmButton.innerText = 'Activate Manual Mode';
    }
    renderValues();
}

const manualInput = document.getElementById('range-linear-motor');

// Disk speed
// Manual range
const diskSpeedInput = document.getElementById('range-disk-speed');
const diskSpeedValue = document.getElementById('disk-speed-value');

diskSpeedInput.addEventListener('input', () => {
    const ppr = 500 - 4.5*diskSpeedInput.value; // points per revolution
    diskDiagram.changeSpeed(ppr);
    renderValues();
});

function renderValues() {
    let diskRpm = 0;
    if (manualMode) {
        // RPM
        const ppr = 500 - 4.5*diskSpeedInput.value; // points per revolution
        diskRpm = Math.round(60000 / (ppr * sendDataInterval));
    }
    diskSpeedValue.innerText = diskRpm;
}


// ------------------------------- //
// ------------ UTIL ------------- //
// ------------------------------- //

// cookies util
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}