"use strict";

document.addEventListener("DOMContentLoaded", init);

async function init() {
    document.querySelector("#map").addEventListener("click", toggleFullScreen);
    document.querySelector("#fullscreenLogo").addEventListener("click", disableFullScreen);
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.querySelector("#map").requestFullscreen().catch(console.log);
        document.querySelector("#fullscreenLogo").style.display = "block";
    }
}

function disableFullScreen() {
    document.exitFullscreen().catch(console.log);
    document.querySelector("#fullscreenLogo").style.display = "none";
}
