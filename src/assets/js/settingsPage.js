"use strict";

document.addEventListener("DOMContentLoaded", init);

async function init() {
    document.querySelector("#startUpdate").addEventListener("click", loadBar);
    const user = JSON.parse(localStorage.getItem("user"));
    document.querySelector("#contactid").innerHTML = `Contactid: ${user.contactid}`;
}


function loadBar() {
    const progress = document.querySelector("#progress");
    document.querySelector("#startUpdate").removeEventListener("click", loadBar);
    const elem = document.querySelector("#progressBar");
    let width = 0;
    const interval = setInterval(frame, 50);

    function frame() {
        if (width >= 100) {
            clearInterval(interval);
            progress.innerHTML = "Successfully updated";
            document.querySelector("#startUpdate").addEventListener("click", loadBar);
        } else {
            width++;
            elem.style.width = width + '%';
            progress.innerHTML = `Updating progress: ${width.toString()}%`;
        }
    }
}
