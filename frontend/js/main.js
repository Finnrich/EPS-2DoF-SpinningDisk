import "./plot";
import "./serial";
import LinearDiagram from "./diagrams/LinearDiagram";

import { diskDiagram } from "./plot";
import { reloadColors, LIGHT, DARK, sendDataInterval } from "./variables/values";
import requests from "./requests";
import util from "./util";

import {
    loginForm,
    diskSpeedInput, diskSpeedValue,
    informationPage, leaderboardPage
} from "./variables/elements";
import { sendInitialSetPoint } from "./serial";

// ------------------------------- //
// ------- LIGHT-DARK MODE ------- //
// ------------------------------- //

changeLDMode(util.getCookie("ldMode") == "0" ? false : true); // check+set light/dark mode from cookies
setTimeout(() => { // prevent onreload flashing to default light mode
    document.querySelector('html').setAttribute('done', 'true');
}, 50);

// change light/dark mode (onclick)
window.changeLDMode = changeLDMode; // global
function changeLDMode(isLightmode) { // boolean -> 1: light, 0: dark
    const selecEl = document.getElementById('ld-modes-selection');
    const root = document.querySelector(':root');
    if (isLightmode) {
        root.style.setProperty("color-scheme", "light");
        selecEl.setAttribute('mode', 'light');
        util.setCookie("ldMode", "1");
        reloadColors(LIGHT);
    } else {
        root.style.setProperty("color-scheme", "dark");
        selecEl.setAttribute('mode', 'dark');
        util.setCookie("ldMode", "0");
        reloadColors(DARK);
    }
    LinearDiagram.ldModeChange();
}


// ------------------------------- //
// ----------- BUTTONS ----------- //
// ------------------------------- //

// Popups
$('.popup-bg').on('click', (e) => {
    e.currentTarget.parentElement.classList.add('hidden');
});

// Manual Mode
// Toggle Manual Mode
export var manualMode = false;

window.toggleManualMode = toggleManualMode; // global
function toggleManualMode() {
    const mmCont = document.getElementById('manual-mode');
    const mmInputs = mmCont.querySelector('.inputs-cont');
    const mmButton = document.getElementById('activate-manual-mode');
    const linearInput = document.getElementById('range-linear-motor');

    if (mmCont.classList.contains('disabled')) {
        // When algorithm is running
        console.error("Manual mode cannot be turned on right now");
    } else if (mmInputs.classList.contains('disabled')) {
        // Manual mode is currently off
        manualMode = true;
        physicalMode = false;
        mmInputs.classList.remove('disabled');
        mmButton.innerText = 'Disable Manual Mode';
        linearInput.setAttribute('min', '0');
        linearInput.setAttribute('max', '100');
    } else {
        // Manual mode is currently on
        manualMode = false;
        mmInputs.classList.add('disabled');
        mmButton.innerText = 'Activate Manual Mode';
    }
    renderValues();
}

// Physical Mode
// Toggle Physical Mode
export var physicalMode = false;

window.togglePhysicalMode = togglePhysicalMode; // global
function togglePhysicalMode() {
    const mmCont = document.getElementById('manual-mode');
    const mmInputs = mmCont.querySelector('.inputs-cont');
    const pmButton = document.getElementById('activate-physical-mode');
    const linearInput = document.getElementById('range-linear-motor');

    if (mmCont.classList.contains('disabled')) {
        // When algorithm is running
        console.error("Physical mode cannot be turned on right now");
    } else if (mmInputs.classList.contains('disabled')) {
        // Manual mode is currently off
        physicalMode = true;
        manualMode = false;
        linearInput.setAttribute('min', '2');
        linearInput.setAttribute('max', '260');
        mmInputs.classList.remove('disabled');
        pmButton.innerText = 'Disable Physical Mode';
    } else {
        // Manual mode is currently on
        physicalMode = false;
        mmInputs.classList.add('disabled');
        pmButton.innerText = 'Activate Physical Mode';
    }
    sendInitialSetPoint(linearInput.value);
    renderValues();
}

// Disk speed
// Manual range

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

// Set disk code at start
setDiskCode(new Event('click'));

// Login
window.openLoginForm = openLoginForm; // global
function openLoginForm() {
    loginForm.parentElement.classList.remove('hidden');
    loginForm.querySelector('input').focus();
}

export function removeLoginRequired() {
    $('.login-required-overlay').hide();
    $('.login-required-reveal').removeClass('disabled');
}

// Leaderboard
    // Open / close
window.openLeaderboard = openLeaderboard; // global
function openLeaderboard() {
    leaderboardPage.classList.remove('hidden');
    informationPage.classList.add('hidden');
    requests.getLeaderboard();
}

window.closeLeaderboard = closeLeaderboard; // global
function closeLeaderboard() {
    leaderboardPage.classList.add('hidden');
    informationPage.classList.remove('hidden');
}

    // Clear input buttons
$('.clear-input').on('click', (e) => {
    const inputEl = e.currentTarget.parentElement.querySelector('input[type=text]');
    inputEl.value = '';
    inputEl.focus();
});

// Arduino
// Upload Parameters
window.uploadParams = uploadParams; // global
function uploadParams() {
    // Linear Values
    const lkpid = document.getElementById('l-kpid').value;
    const ltn   = document.getElementById('l-tn').value;
    const ltv   = document.getElementById('l-tv').value;

    // Rotational Values
    const rkpid = document.getElementById('r-kpid').value;
    const rtn   = document.getElementById('r-tn').value;
    const rtv   = document.getElementById('r-tv').value;

    // Upload to Arduino
    //
    // 
    //
}