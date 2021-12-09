"use strict";

document.addEventListener("DOMContentLoaded", init);

let currentPage = document.querySelector('#echoMapPage');

async function init() {
    console.log("Maps loaded");
    document.querySelector("#proximitychat").addEventListener("click", goToGeneralChat);
    getLocation();
}

function goToGeneralChat(e){
    e.preventDefault();
    localStorage.setItem("currentchattype","public")
    location.replace("chatroom.html")
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
        controls: [new ol.control.FullScreen(), new ol.control.Zoom()],
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([position.coords.longitude, position.coords.latitude]),
            zoom: 11
        })

    });
    addMarkerLayer(map, position.coords.longitude, position.coords.latitude, 'Your marker');
    addProximityLayer(map, position.coords.longitude, position.coords.latitude);
}

function addMarkerLayer(map, longitude, latitude, markerName) {
    let feature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude])),
        name: markerName,
        type: "marker",
        fullName: "Bilal Ben Mohammadi",
        soundName: "Traffic"
    });

    let markerLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
                features: [
                    feature
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

    let container = document.getElementById('popup');
    let content = document.getElementById('popup-content');
    let closer = document.getElementById('popup-closer');

    let overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });
    map.addOverlay(overlay);

    closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };

    /**
     * Add a click handler to the map to render the popup.
     */
    map.on('singleclick', function (evt) {
        const coordinate = evt.coordinate;
        const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
            return feature;
        });
        if (feature && feature.A.type === "marker") {
            if(feature.A.name === "friend"){
                content.innerHTML = '<p>' + feature.get('fullName') + '</p><code>' + feature.get('name')
                    +  '</code>' + '<br><button>Chat</button> <button>Fastest route</button>';

            }
            else {
                content.innerHTML = '<p>' + feature.get('soundName') + '</p><code>' + feature.get('name')
                    +  '</code>' + '<br><button>Mute</button> <button id="goToAudioPage" >See all noises</button>';
                document.querySelector('#goToAudioPage').addEventListener("click", () => {
                    location.replace("audio.html");
                });
            }
            overlay.setPosition(coordinate);
        }else {
            overlay.setPosition(undefined);
            closer.blur();
        }
    });

    /**
     * Making the pointer change when hovering a marker.
     */

    map.on('pointermove', function (evt) {
        const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
            return feature;
        });
        if (feature && feature.A.type === "marker") {
            document.body.style.cursor = "pointer";
        } else {
            document.body.style.cursor = "";
        }
    });

    map.on('postcompose',function(e){
        document.querySelector('canvas').style.filter="invert(90%)";
    });


}

function addProximityLayer(map, longitude, latitude) {
    const centerLongitudeLatitude = ol.proj.fromLonLat([longitude, latitude]);
    const proxlayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            projection: 'EPSG:4326',
            features: [
                new ol.Feature({
                    geometry: new ol.geom.Circle(centerLongitudeLatitude, 4000),
                    name: 'Your range'
                })
            ]
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

    const number = randomIntFromInterval(-4000, 4000);
    const randomLong = longitude - number / 111320 * Math.cos(latitude);
    const randomLat = latitude - number / 110574;

    addMarkerLayer(map, randomLong, randomLat, 'friend');
    randomLocation(map, longitude, latitude);
}

function randomLocation(map, longitude, latitude) {
    const number = randomIntFromInterval(-4000, 4000);
    const randomLong = longitude - number / 111320 * Math.cos(latitude);
    const randomLat = latitude - number / 110574;
    addMarkerLayer(map, randomLong, randomLat, 'sound');
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
