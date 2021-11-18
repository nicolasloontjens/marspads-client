"use strict";

document.addEventListener("DOMContentLoaded", init);

async function init() {

    document.querySelector("#muteAll").addEventListener("click", muteAll);
    document.querySelectorAll(".slider").forEach(e => e.addEventListener("touchend", getSelectedSlider));
}

function muteAll(){

}

function getSelectedSlider(ev){
    let sliderName = ev.currentTarget.getAttribute("data-slider");
    let sliderValue = ev.target.value;
    console.log(sliderName ,sliderValue);
}