"use strict";

document.addEventListener("DOMContentLoaded", init);
let traficAudio = document.querySelector("#trafficAudioFile");

async function init() {
    console.log("Audio controls loaded.")
    document.querySelector("#muteAll").addEventListener("click", muteAll);
    document.querySelectorAll(".slider").forEach(e => e.addEventListener("change", getSelectedSlider));
    document.querySelector("#play").addEventListener("click", playSound);
    document.querySelector("#closeSettings").addEventListener("click", closeOverlay);
    document.querySelector("#audiNav").addEventListener("click", openOverlay);
}

function playSound() {

    traficAudio.play();
    console.log("play");
}

function openOverlay() {
    document.querySelector(".overlaySliders").style.display = "block";
    return false;
}

function closeOverlay() {
    console.log("sluiten");
    document.querySelector(".overlaySliders").style.display = "none";
}

/* (this will make the audio autoplay
function loadAudio() {
    let promise = document.querySelector("#trafficAudioFile").play();

    if (promise !== undefined) {
        promise.then(_ => {
            console.log("Autoplay started.")
        }).catch(error => {
            console.log("Autoplay was prevented.", error);
            document.querySelector(".play").style.display = "block";
        });
    }
}
*/
function muteAll() {
    traficAudio.muted = true;
}

function getSelectedSlider(ev) {
    const sliderName = ev.currentTarget.getAttribute("data-slider");
    const sliderValue = ev.target.value;
    const convertedValue = sliderValue / 10;
    console.log(sliderName, convertedValue);
    setVolumeOfAudio(sliderName, convertedValue);
}

function setVolumeOfAudio(sliderName, sliderValue) {
    if (sliderName === "media") {
        document.querySelector("#media").volume = sliderValue;
    }

    if (sliderName === "talking") {
        document.querySelector("#talking").volume = sliderValue;
    }
    if (sliderName === "traffic") {
        traficAudio.volume = sliderValue;
    }
    if (sliderName === "constructionNoises") {
        document.querySelector("#constructionNoises").volume = sliderValue;
    }

}

