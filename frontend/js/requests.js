import { 
    uploadRunForm, uploadResultBtn, sessionIdInput,
    diskCodeForm, diskCodeInput, diskCodeValue,
    loginForm, username, password,
    lbForm, lbSessionIdInput, lbDiskCodeInput, lbTable, lbPageCount, lbPageInput
} from "./variables/elements";

import { removeLoginRequired } from "./main";

import { diskDiagram } from "./plot";


// Enter disk code
window.setDiskCode = setDiskCode; // global
function setDiskCode(e) {
    e.preventDefault();

    diskCodeForm.setAttribute('err-msg', '');

    const dc = diskCodeInput.value;
    let optPath = [];
    let optPathWidth;

    // Get disk path from DB
    $.ajax({
        method: 'GET',
        url: '/2dof/api/v1/disks',
        data: {
            'did': dc
        },
        success: function(resultData) {
            optPath = resultData.path;
            optPathWidth = resultData.width;
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
            diskCodeValue.innerText = '-';
        },
        complete: function() {
            diskDiagram.setOptPath(optPath, optPathWidth);
        }
    });
}


// Login
window.login = login; // global
function login(e) {
    e.preventDefault();

    loginForm.setAttribute('err-msg', '');

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
window.uploadRun = uploadRun; // global
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
window.getLeaderboard = getLeaderboard; // global
export function getLeaderboard(e=new Event('')) {
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

    if (lbPageInput.value !== '') {
        // set page
        data.page = lbPageInput.value;
    }

    $.ajax({
        method: 'GET',
        url: '/2dof/api/v1/runs',
        data: data,
        success: function(resultData) {
            $(lbTable).find('tr.entry').remove();
            resultData.runs.forEach((run) => {
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

            // page management
            const pageCount = Math.ceil(resultData.count / resultData.itemsPerPage);
            lbPageCount.innerText = pageCount;
            lbPageInput.value = resultData.page || '';
            lbTable.setAttribute('page', resultData.page);
            lbTable.style.counterReset = 'entries ' + ((resultData.page - 1) * resultData.itemsPerPage);
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

export default {
    setDiskCode,
    login,
    isLoggedIn,
    uploadRun,
    getLeaderboard
};