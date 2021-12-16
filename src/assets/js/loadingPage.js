"use strict";

document.addEventListener("DOMContentLoaded", init);

async function init() {
    await addLoadingAnimation();
    setTimeout(function () {
        location.replace("index.html");
    }, 9500);
}


async function addLoadingAnimation() {
    document.querySelector("body").setAttribute("animation", "true")
    document.querySelector("body").innerHTML += `<div class="animation">
        <img class="rocket" src="assets/images/rocket.png">
            <div class="longfazers">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <h1>loading</h1></div>`
    await new Promise(resolve => setTimeout(resolve, 600))//display loading animation;
}

function removeAnimation() {
    document.querySelector("body").removeAttribute("animation");
    let elem = document.querySelector(".animation");
    elem.remove();
}