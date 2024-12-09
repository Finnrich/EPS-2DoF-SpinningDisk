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
        root.style.setProperty("color-scheme", "light");
        selecEl.setAttribute('mode', 'light');
        setCookie("ldMode", "1");
        clrBG = getComputedStyle(document.body).getPropertyValue('--lmBG');
        clrButton = getComputedStyle(document.body).getPropertyValue('--lmButton');
    } else {
        root.style.setProperty("color-scheme", "dark");
        selecEl.setAttribute('mode', 'dark');
        setCookie("ldMode", "0");
        clrBG = getComputedStyle(document.body).getPropertyValue('--dmBG');
        clrButton = getComputedStyle(document.body).getPropertyValue('--dmButton');
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

// Enter disk code
const diskCodeForm = document.getElementById('disk-code-form');
const diskCodeInput = document.getElementById('disk-code-input');
const diskCodeValue = document.getElementById('disk-code-value');

function setDiskCode(e) {
    e.preventDefault();

    diskCodeForm.setAttribute('err-msg', '');

    const dc = diskCodeInput.value;

    // Get disk path from DB
    $.ajax({
        method: 'GET',
        url: '/2dof/api/v1/disks',
        data: {
            'did': dc
        },
        success: function(resultData) {
            optPath = resultData.path;
            diskCodeValue.innerText = dc;
            if (lbDiskCodeInput.value === '') {
                // set disk code input on leaderboard page
                lbDiskCodeInput.value = diskCodeInput.value;
            }
        },
        error: function(e) {
            if (dc != '') {
                diskCodeForm.setAttribute('err-msg', 'Disk code does not exist');
            }
            optPath = [];
            diskCodeValue.innerText = '-';
        },
        complete: function() {
            diskDiagram.setOptPath(optPath, optPathWidth);
        }
    });
}
setDiskCode(new Event('click'));

// Login
const loginForm = document.getElementById('login-form');
const username = document.getElementById('username');
const password = document.getElementById('password');

function openLoginForm() {
    loginForm.parentElement.classList.remove('hidden');
    loginForm.querySelector('input').focus();
}

function removeLoginRequired() {
    $('.login-required-overlay').hide();
    $('.login-required-reveal').removeClass('disabled');
}

function login(e) {
    e.preventDefault();

    loginForm.setAttribute('err-msg', '');

    const loginData = new FormData(loginForm);

    $.ajax({
        method: 'POST',
        url: '/2dof/api/v1/login',
        data: {
            "username": username.value,
            "password": password.value
        },
        success: function(resultData) {
            loginForm.parentElement.classList.add('hidden');
            removeLoginRequired();
        },
        error: function(e) {
            loginForm.setAttribute('err-msg', 'Login failed!');
        }
    });
}

function isLoggedIn() {
    $.ajax({
        method: 'GET',
        url: '/2dof/api/v1/is_logged_in',
        success: function(resultData) {
            if (resultData === "1") {
                removeLoginRequired();
            }
        }
    });
}
isLoggedIn(); // check if user is logged in at the start

// Upload run evaluation
const uploadRunForm = document.getElementById('upload-run-form');
const sessionIdInput = document.getElementById('session-id-input');
const uploadResultBtn = document.getElementById('upload-result');

function uploadRun(e) {
    e.preventDefault();

    uploadResultBtn.classList.add('disabled');
    uploadRunForm.setAttribute('err-msg', '');

    $.ajax({
        method: 'POST',
        url: '/2dof/api/v1/runs',
        data: {
            "sid": sessionIdInput.value,
            "did": diskCodeInput.value,
            "eval": diskDiagram.getEvaluationAvg()
        },
        success: function() {
            if (lbSessionIdInput.value === '') {
                // set session id input on leaderboard page
                lbSessionIdInput.value = sessionIdInput.value;
            }
            setTimeout(() => uploadResultBtn.classList.remove('disabled'), 800);
        },
        error: function(e) {
            if (e.status === 404) {
                uploadRunForm.setAttribute('err-msg', 'Session does not exist!');
            } else if (e.status === 409) {
                uploadRunForm.setAttribute('err-msg', 'This run was already uploaded!');
            } else {
                uploadRunForm.setAttribute('err-msg', 'Upload failed!');
            }
            uploadResultBtn.classList.remove('disabled');
        }
    });
}

// Leaderboard
    // Open / close
const informationPage = document.getElementById('information-page');
const leaderboardPage = document.getElementById('leaderboard-page');

function openLeaderboard() {
    leaderboardPage.classList.remove('hidden');
    informationPage.classList.add('hidden');
    getLeaderboard();
}

function closeLeaderboard() {
    leaderboardPage.classList.add('hidden');
    informationPage.classList.remove('hidden');
}

    // Clear input buttons
    $('.clear-input').on('click', (e) => {
        e.currentTarget.parentElement.querySelector('input[type=text]').value = '';
    });

    // Get & handle leaderboard data

const lbForm = document.getElementById('lb-form');
const lbSessionIdInput = document.getElementById('lb-session-id-input');
const lbDiskCodeInput = document.getElementById('lb-disk-code-input');
const lbTable = document.getElementById('leaderboard-table');

function getLeaderboard(e=new Event('')) {
    e.preventDefault();

    lbForm.setAttribute('err-msg', '');
    $(lbTable).find('tr.entry').remove();

    // filter by session id
    let data = {
        "sid": lbSessionIdInput.value
    };

    if (lbDiskCodeInput.value !== '') {
        // also filter by disk code
        data.did = lbDiskCodeInput.value;
    }

    $.ajax({
        method: 'GET',
        url: '/2dof/api/v1/runs',
        data: data,
        success: function(resultData) {
            $(lbTable).find('tr.entry').remove();
            resultData.forEach((run) => {
                $(lbTable)
                .append($('<tr></tr>')
                    .addClass('entry')
                    .append($('<td></td>'))
                    .append($('<td></td>')
                        .text(run.username))
                    .append($('<td></td>')
                        .text(run.eval + "%"))
                    .append($('<td></td>')
                        .text(run.ts_created))
                    .append($('<td></td>')
                        .text(run.disk_code))
                    .append($('<td></td>')
                        .text(run.session_id))
                );
            });
        },
        error: function(err) {
            if (err.status === 404) {
                // don't show if function was called automated (no real event)
                if (e.type !== '') lbForm.setAttribute('err-msg', 'No runs found!');
            } else {
                lbForm.setAttribute('err-msg', 'Something went wrong (' + err.status + ')!');
            }
        }
    });
}

// Arduino
// Upload Parameters
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