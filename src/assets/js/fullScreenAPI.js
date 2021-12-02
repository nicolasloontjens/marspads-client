"use strict";

document.addEventListener("DOMContentLoaded", init);

async function init() {
    document.querySelector("#map").addEventListener("dblclick", toggleFullScreen);}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.querySelector("#map").requestFullscreen().catch(console.log);
    }
}

function disableFullScreen() {
    document.exitFullscreen().catch(console.log);
}
