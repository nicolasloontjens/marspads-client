"use strict";

document.addEventListener("DOMContentLoaded", init);
const traficAudio = document.querySelector("#trafficAudioFile");
const talkingAudio = document.querySelector("#talkingFile");
const mediaAudio = document.querySelector("#mediaFile");
const constructionAudio = document.querySelector("#constructionNoisesFile");

async function init() {
    document.querySelector("#muteAll").addEventListener("click", muteAll);
    document.querySelectorAll(".slider").forEach(e => e.addEventListener("change", getSelectedSlider));
    document.querySelector("#play").addEventListener("click", playSound);
    document.querySelector("#closeSettings").addEventListener("click", closeOverlay);
}

function playSound() {
    mediaAudio.play();
    talkingAudio.play();
    traficAudio.play();
    constructionAudio.play();

}

function openOverlay() {
    document.querySelector(".overlaySliders").style.display = "block";
    return false;
}

function closeOverlay() {
    console.log("sluiten");
    document.querySelector(".overlaySliders").style.display = "none";
}


function muteAll() {
    document.querySelectorAll(".slider").forEach(slider => slider.value = 0);
    traficAudio.volume = 0;
    mediaAudio.volume = 0;
    talkingAudio.volume = 0;
    constructionAudio.volume = 0;
}

function getSelectedSlider(ev) {
    const sliderName = ev.currentTarget.getAttribute("data-slider");
    const sliderValue = ev.target.value;
    const convertedValue = sliderValue / 10;
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

