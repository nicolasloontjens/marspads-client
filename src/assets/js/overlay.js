
"use strict";

document.addEventListener("DOMContentLoaded", init);


async function init() {
    document.querySelector(".overlay").addEventListener("click",on);
}

function on() {
    document.getElementById("overlay").style.display = "block";
}

function off() {
    document.getElementById("overlay").style.display = "none";
}
