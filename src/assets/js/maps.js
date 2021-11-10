"use strict"

//const randomLocation = require("random-location");
document.addEventListener("DOMContentLoaded", init);

async function init() {
    console.log("Maps loaded");
    getLocation();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(creatingMaps);
        console.log(navigator.geolocation);
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
            zoom: 13
        })

    })
    addMarkerLayer(map, position.coords.longitude, position.coords.latitude)
    addProximityLayer(map, position.coords.longitude, position.coords.latitude)
}

function addMarkerLayer(map, longitude, latitude) {
    let markerLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
                features: [
                    new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude]))
                    })
                ]
            }
        ), style: new ol.style.Style({
            image: new ol.style.Icon({
                src: "assets/images/newMarker.png",
                anchor: [0.5, 1]
            })

        })
    });
    map.addLayer(markerLayer);
}

function addProximityLayer(map, longitude, latitude) {
    let centerLongitudeLatitude = ol.proj.fromLonLat([longitude, latitude]);
    let proxlayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            projection: 'EPSG:4326',
            features: [new ol.Feature(new ol.geom.Circle(centerLongitudeLatitude, 4000))]
        }),
        style: [
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'blue',
                    width: 3
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(0, 0, 255, 0.1)'
                })
            })
        ]
    });
    map.addLayer(proxlayer);

    let number = randomIntFromInterval(-4000, 4000);
    let randomLong = longitude - number/111320 * Math.cos(latitude);
    let randomLat = latitude - number/110574;

    console.log(randomLong, randomLat);

    addMarkerLayer(map, randomLong, randomLat)

    const P = {
        latitude: latitude,
        longitude: longitude
    }

    const R = 3900 // meters

    const randomPoint = randomLocation.randomCirclePoint(P, R)
}

function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)

}






