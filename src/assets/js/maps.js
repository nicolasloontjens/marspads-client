"use strict"

document.addEventListener("DOMContentLoaded", init);

async function init() {
    console.log("Maps loaded");
    getLocation();

}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(creatingMaps);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }

}

function creatingMaps(position) {
    const map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([position.coords.longitude, position.coords.latitude]),
            zoom: 10
        })

    })


    let markerLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [
                new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([position.coords.longitude, position.coords.latitude]))
                })
            ]

        }
        ), style: new ol.style.Style({
            image: new ol.style.Icon({
                src: "assets/images/marker.png",
                anchor: [0.5, 1]
            })


        })
    });
    map.addLayer(markerLayer);

}




