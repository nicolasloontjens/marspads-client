"use strict";

document.addEventListener("DOMContentLoaded", init);

async function init() {
    document.querySelector("#startUpdate").addEventListener("click", loadBar);
}


function loadBar() {

    let elem = document.querySelector("#progressBar");
    let width = 0;
    let interval = setInterval(frame, 50);

    function frame() {
        if (width >= 100) {
            clearInterval(interval);
            document.querySelector("#progress").innerHTML = "Successfully updated";
        } else {
            width++;
            elem.style.width = width + '%';
            document.querySelector("#number").innerHTML = width.toString();
        }
    }
}