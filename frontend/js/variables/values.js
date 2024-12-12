export const dpr = window.devicePixelRatio || 1;
export const clrYourPath = getComputedStyle(document.body).getPropertyValue('--clr-yourPath');
export const clrOptPath = getComputedStyle(document.body).getPropertyValue('--clr-optPath');
export var clrBG = getComputedStyle(document.body).getPropertyValue('--lmBG');
export var clrButton = getComputedStyle(document.body).getPropertyValue('--lmButton');

export const LIGHT = 0;
export const DARK = 1;
export function reloadColors(mode) {
    switch (mode) {
        case LIGHT:
            clrBG = getComputedStyle(document.body).getPropertyValue('--lmBG');
            clrButton = getComputedStyle(document.body).getPropertyValue('--lmButton');
            break;
        case DARK:
            clrBG = getComputedStyle(document.body).getPropertyValue('--dmBG');
            clrButton = getComputedStyle(document.body).getPropertyValue('--dmButton');
    }
}

export const sendDataInterval = 20;