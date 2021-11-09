"use strict"



document.addEventListener("DOMContentLoaded", init);


const map = new ol.Map({
    target: 'centra-map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([4.34878, 50.85045]),
        zoom: 10
    })
})

async function init() {
    console.log("Maps loaded");
    creatingMaps();

}

function creatingMaps(){
    const map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([4.34878, 50.85045]),
            zoom: 10
        })
    })

}