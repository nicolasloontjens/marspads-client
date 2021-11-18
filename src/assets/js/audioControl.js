"use strict";

document.addEventListener("DOMContentLoaded", init);

async function init() {

    loadAudio();
    document.querySelector("#muteAll").addEventListener("click", muteAll);
    document.querySelectorAll(".slider").forEach(e => e.addEventListener("change", getSelectedSlider));
    document.querySelector(".play").addEventListener("click", playSoundAgain);
}

function playSoundAgain() {
    document.querySelector("#trafficAudioFile").play();
}

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

function muteAll() {
    document.querySelector("#trafficAudioFile").muted = true;
}

function getSelectedSlider(ev) {
    let sliderName = ev.currentTarget.getAttribute("data-slider");
    let sliderValue = ev.target.value;
    let convertedValue = sliderValue / 10;
    console.log(sliderName, convertedValue);
    setVolumeOfAudio(sliderName, convertedValue);
}

function setVolumeOfAudio(sliderName, sliderValue) {
    if (sliderName === "media") {

    }

    if (sliderName === "talking") {

    }
    if (sliderName === "traffic") {
        document.querySelector("#trafficAudioFile").volume = sliderValue;
    }
    if (sliderName === "constructionNoises") {

    }

}

