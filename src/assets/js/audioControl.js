"use strict";

document.addEventListener("DOMContentLoaded", init);
let traficAudio = document.querySelector("#trafficAudioFile");
let talkingAudio = document.querySelector("#talkingFile");
let mediaAudio = document.querySelector("#mediaFile");
let constructionAudio = document.querySelector("#constructionNoisesFile");

async function init() {
    console.log("Audio controls loaded.")
    document.querySelector("#muteAll").addEventListener("click", muteAll);
    document.querySelectorAll(".slider").forEach(e => e.addEventListener("change", getSelectedSlider));
    document.querySelector("#play").addEventListener("click", playSound);
    document.querySelector("#closeSettings").addEventListener("click", closeOverlay);
    document.querySelector("#audiNav").addEventListener("click", openOverlay);
}

function playSound() {

    unmuteAll();

    mediaAudio.play();

    talkingAudio.play();

    traficAudio.play();

    constructionAudio.play();

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
    mediaAudio.muted = true;
    talkingAudio.muted = true;
    constructionAudio.muted = true;
}


function unmuteAll() {
    traficAudio.muted = false;
    mediaAudio.muted = false;;
    talkingAudio.muted = false;;
    constructionAudio.muted = false;;
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
        mediaAudio.volume = sliderValue;
    }
    if (sliderName === "talking") {
        talkingAudio.volume = sliderValue;
    }
    if (sliderName === "traffic") {
        traficAudio.volume = sliderValue;
    }
    if (sliderName === "constructionNoises") {
        constructionAudio.volume = sliderValue;
    }

}

