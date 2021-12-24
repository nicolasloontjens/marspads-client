"use strict";

document.addEventListener("DOMContentLoaded", init);

let map;
const maplayers = {};
const fixedmarkercoords = [{longitude: 51.19092153443029, latitude: 3.212451691473603}, {
    longitude: 51.19161388290666,
    latitude: 3.2144224156205
}, {longitude: 51.191910575737946, latitude: 3.21549442481909}, {
    longitude: 51.19187250825284,
    latitude: 3.214467410833324
}, {longitude: 51.191830575737946, latitude: 3.2160007275947136}, {
    longitude: 51.1914709406873,
    latitude: 3.21423239440734
}];
const dataNames = ['Ben Mohammadi Bilal', 'Follet stijn', 'Hammering', 'Car', 'Walking', 'Loontjens Nicolas', 'Vandewalle Reinaerd'];
const yourLocation = [3.2145869436534724, 51.19167462236231];
let routeLayer;

async function init(){
    if(sessionStorage.getItem("hasVisited") === null){
        await addLoadingAnimation();
        sessionStorage.setItem("hasVisited",true);
    }
    document.querySelector("#proximitychat").addEventListener("click", goToGeneralChat);
    createBasicMap();
    addProximityLayer();//draw the circle around the user that simulates the range of users
    addOtherLayers(fixedmarkercoords);//add the friend layers, other user layer
    addCheckboxEventListener();//activate filter feature
    document.querySelector("#map").addEventListener("dblclick", toggleFullScreen);
    document.querySelector("#map").addEventListener("dbltap", toggleFullScreen);
}

function goToGeneralChat(e){
    e.preventDefault();
    localStorage.setItem("currentchattype","public");
    location.replace("chatroom.html");
}

function createBasicMap(){
    const user = new ol.Feature({
        type:"marker",
        geometry: new ol.geom.Point(ol.proj.fromLonLat(yourLocation))
    });
    const userVector = new ol.source.Vector({
        features: [user]
    });
    const userLayer = new ol.layer.Vector({
        source: userVector,
        style: new ol.style.Style({
            image: new ol.style.Icon({
                src:"./assets/images/marker.png",
                anchor: [0.5,1],
                scale:[1,1]
            })
        })
    });
    maplayers["currentuserlayer"] = userLayer;
    map = new ol.Map({
        controls: [new ol.control.FullScreen(), new ol.control.Zoom()],
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
            userLayer
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat(yourLocation),
            zoom: 17
        })
    });
    map.on('postcompose',function(e){
        document.querySelector('canvas').style.filter="invert(90%)";
    });
    let dblclickinteraction = null;
    map.getInteractions().getArray().forEach(function(interaction) {
      if (interaction instanceof ol.interaction.DoubleClickZoom) {
        dblclickinteraction = interaction;
      }
    });
    map.removeInteraction(dblclickinteraction);
}

function addOtherLayers(arrayofcoords){
    function createMarkerFeature(coords, datatype, dataName){
        return new ol.Feature({
            type:"marker",
            data: datatype,
            dataName: dataName,
            geometry: new ol.geom.Point(ol.proj.fromLonLat([coords.latitude,coords.longitude]))
        });
    }
    const friendfeatures = [];
    const otheruserfeatures = [];
    const soundfeatures = [];
    for(let i = 0; i < 2; i++){
        friendfeatures.push(createMarkerFeature(arrayofcoords[i],"friend", dataNames[i]));
    }
    for(let i = 2; i < 5; i++){
        soundfeatures.push(createMarkerFeature(arrayofcoords[i],"sound", dataNames[i]));
    }
    for(let i = 5; i < 6; i++){
        otheruserfeatures.push(createMarkerFeature(arrayofcoords[i],"user", dataNames[i]));
    }
    const friendlayer = new ol.layer.Vector({
        source: new ol.source.Vector({features:friendfeatures}),
        style: new ol.style.Style({
            image: new ol.style.Icon({
                src: "./assets/images/friendicon.png",
                anchor: [0.5,1],
                scale: [0.09,0.09]
            })
        })
    });
    const otheruserslayer = new ol.layer.Vector({
        source: new ol.source.Vector({features:otheruserfeatures}),
        style: new ol.style.Style({
            image: new ol.style.Icon({
                src: "./assets/images/strangericon.png",
                anchor: [0.5,1],
                scale: [0.1,0.1]
            })
        })
    });
    const soundlayer = new ol.layer.Vector({
        source: new ol.source.Vector({features:soundfeatures}),
        style: new ol.style.Style({
            image: new ol.style.Icon({
                src: "./assets/images/soundiconmap.png",
                anchor: [0.5,1],
                scale: [0.09,0.09]
            })
        })
    });
    maplayers["strangerlayer"] = otheruserslayer;
    maplayers["friendlayer"] = friendlayer;
    maplayers["soundlayer"] = soundlayer;
    map.addLayer(otheruserslayer);
    map.addLayer(soundlayer);
    map.addLayer(friendlayer);

    const container = document.getElementById('popup');
    const closer = document.getElementById('popup-closer');

    const overlay = new ol.Overlay({
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
            addPopupContent(feature);
            if (document.querySelector('.routeButton') !== null) {
                findTheWay(feature, overlay);
            }
            if (document.querySelector('.audioPopUp') !== null) {
                document.querySelector(".audioPopUp").addEventListener("click", openOverlay);
            }
            if (document.querySelector('.audioPopUpMute') !== null) {
                document.querySelector(".audioPopUpMute").addEventListener("click", muteAll);
            }
            if(document.querySelector(".chatbutton") !== null){
                document.querySelector(".chatbutton").addEventListener("click", () => {
                    location.replace("chatroom.html");
                });
            }
            overlay.setPosition(coordinate);
        } else {
            overlay.setPosition(undefined);
            closer.blur();
        }
    });

}

function addPopupContent(feature){
    const content = document.getElementById('popup-content');
    const dataToUpperCase = feature.get('data').charAt(0).toUpperCase() + feature.get('data').slice(1);

    if (feature.A.data === "friend" || feature.A.data === "user") {
        content.innerHTML = `<p> ${feature.get('dataName')} <br><span>  ${dataToUpperCase} </span> </p>
            <br><button class="chatbutton">Chat</button> <button class="routeButton" >Fastest route</button>`;
    } else {
        content.innerHTML = `<p>  ${feature.get('dataName')} <br><span> ${dataToUpperCase} </span></p>
            <br><button class="audioPopUpMute" >Mute</button> <button class="audioPopUp" >See all noises</button>`;
    }
}

function addProximityLayer() {
    const centerLongitudeLatitude = ol.proj.fromLonLat(yourLocation);
    const proxlayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            projection: 'EPSG:4326',
            features: [
                new ol.Feature({
                    geometry: new ol.geom.Circle(centerLongitudeLatitude, 400),
                    name: 'Your range'
                })
            ]
        }),
        style: [
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'yellow',
                    width: 3
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 0, 0, 0.1)'
                })
            })
        ]
    });
    maplayers["proximitylayer"] = proxlayer;
    map.addLayer(proxlayer);
}

function addCheckboxEventListener(){
    const checkboxes = document.querySelectorAll("input[type=checkbox][name=filter]");
    let enabledFilters = [];

    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change",() => {
            enabledFilters = Array.from(checkboxes).filter(i => i.checked).map(i => i.value);
            updateMapLayers(enabledFilters);
        });
    });
}

function updateMapLayers(enabledFilters){
    Object.values(maplayers).forEach(layer => map.removeLayer(layer));
    const maplayerstoapply = {proximitylayer:maplayers["proximitylayer"]};
    enabledFilters.forEach((filtervalue) => {
        maplayerstoapply[filtervalue] = maplayers[filtervalue];
    });
    Object.values(maplayerstoapply).forEach(layer => map.addLayer(layer));
}

function toggleFullScreen(){
    const map = document.querySelector("#map");
    if(!document.fullscreenElement){
        map.requestFullscreen();
    }
    else{
        if(document.exitFullscreen){
        document.exitFullscreen();
        }
    }
}

function drawRoute(route){
    const polyline = route.geometry.coordinates.map(el => ol.proj.fromLonLat(el));

    return new ol.layer.Vector({
        source:  new ol.source.Vector({
            features: [ new ol.Feature({
                type: 'route',
                geometry: new ol.geom.LineString(polyline)
            })]
        }),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                width: 6,
                color:[255, 87, 34, 0.8]
            })
        })
    });
}

function findTheWay(feature, overlay){
    const endLonLat = ol.proj.transform(feature.A.geometry.flatCoordinates, 'EPSG:3857', 'EPSG:4326');
    const routeButton = document.querySelector('.routeButton');

    routeButton.addEventListener("click", function(){
        map.removeLayer(routeLayer);
        getClosestRoute(endLonLat).then(response => {
            const{route} = response;
            routeLayer = drawRoute(route);
            map.addLayer(routeLayer);
        });
        overlay.setPosition(undefined);
        routeButton.blur();
    });
}

async function getClosestRoute(endLonLat) {
    const API_KEY = '5b3ce3597851110001cf624814086a7454a5498e922d0f028ec7db66';
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}&start=${yourLocation[0]},${yourLocation[1]}&end=${endLonLat[0]},${endLonLat[1]}`;
    const response = await fetch(url);
    const result = await response.json();
    return {route: result.features[0]};
}

async function addLoadingAnimation() {
    document.querySelector("body").setAttribute("animation", "true");
    document.querySelector("body").innerHTML += `<div class="animation">
        <img class="rocket" src="assets/images/rocket.png">
            <div class="longfazers">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <h1>loading</h1></div>`;
    await new Promise(resolve => setTimeout(resolve, 2000));//display loading animation;
    document.querySelector("body").removeAttribute("animation");
    const elem = document.querySelector(".animation");
    elem.remove();
}
