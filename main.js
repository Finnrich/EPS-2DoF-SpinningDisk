

// changeLDMode(getCookie("ldMode") == "0" ? false : true); // check+set light/dark mode from cookies
// setTimeout(() => { // prevent onreload flashing to default light mode
//     document.querySelector('html').setAttribute('done', 'true');
// }, 50);

// change light/dark mode (onclick)
function changeLDMode(isLightmode) { // boolean -> 1: light, 0: dark
    const selecEl = document.getElementById('ld-modes-selection');
    const root = document.querySelector(':root');
    if (isLightmode) {
        if (selecEl.getAttribute('mode') != 'light') {
            root.style.setProperty("color-scheme", "light");
            selecEl.setAttribute('mode', 'light');
            setCookie("ldMode", "1");
        }
    } else {
        if (selecEl.getAttribute('mode') != 'dark') {
            root.style.setProperty("color-scheme", "dark");
            selecEl.setAttribute('mode', 'dark');
            setCookie("ldMode", "0");
        }
    }
}






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