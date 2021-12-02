"use strict";

document.addEventListener("DOMContentLoaded", init);

let currentPage = document.querySelector('#echoMapPage');

async function init() {
    console.log("Maps loaded");
    getLocation();
    hiddenPages();
    document.querySelectorAll('main aside nav a').forEach(
        item => item.addEventListener('click', navigation)
    );

    document.querySelector('#arrowNav').addEventListener('click', MakeNavigationRetract);

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

    });
    addMarkerLayer(map, position.coords.longitude, position.coords.latitude, 'Your marker');
    addProximityLayer(map, position.coords.longitude, position.coords.latitude);
}

function addMarkerLayer(map, longitude, latitude, markerName) {
    let feature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude])),
        name: markerName,
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

    onclick(map, content, overlay, closer);


}

function onclick(map, content, overlay, closer) {
    map.on('singleclick', function (event) {
        if (map.hasFeatureAtPixel(event.pixel) === true) {
            let coordinate = event.coordinate;
            content.innerHTML = '<b>Hello world!</b><br />I am a popup.';
            overlay.setPosition(coordinate);
        } else {
            overlay.setPosition(undefined);
            closer.blur();
        }
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

    addMarkerLayer(map, randomLong, randomLat, 'Your friend');
    randomLocation(map, longitude, latitude);
}


function randomLocation(map, longitude, latitude) {
    const number = randomIntFromInterval(-4000, 4000);
    const randomLong = longitude - number / 111320 * Math.cos(latitude);
    const randomLat = latitude - number / 110574;
    addMarkerLayer(map, randomLong, randomLat, 'test');
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);

}

function hiddenPages() {
    document.querySelectorAll('section').forEach(item => item.classList.toggle('hidden'));
    document.querySelector('#echoMapPage').classList.toggle('hidden');
    document.querySelector('main aside nav').classList.toggle('hidden');

}

function navigation(e) {
    e.preventDefault();
    const pageId = e.target.parentElement.getAttribute('href');
    const nextPage = document.querySelector(`${pageId}`);
    switchPage(currentPage, nextPage);
    currentPage = nextPage;
}

function switchPage(previousPage, nextPage) {
    previousPage.classList.toggle('hidden');
    nextPage.classList.toggle('hidden');
}

function MakeNavigationRetract(e) {
    e.preventDefault();
    document.querySelector('main aside nav').classList.toggle('hidden');
}
