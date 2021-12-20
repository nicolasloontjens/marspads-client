"use strict";

document.addEventListener("DOMContentLoaded", init);

let map;
let maplayers = {};
const fixedmarkercoords = [{longitude:51.19092153443029,latitude: 3.212451691473603},{longitude:51.19161388290666,latitude: 3.2144224156205},{longitude:51.191910575737946,latitude: 3.21549442481909},{longitude:51.19187250825284,latitude: 3.214467410833324},{longitude:51.191830575737946,latitude: 3.2160007275947136},{longitude:51.1914709406873,latitude: 3.21423239440734}]
const dataNames =['Ben Mohammadi Bilal', 'Follet stijn','Hammering', 'Car', 'Walking', 'Loontjens Nicolas', 'Vandewalle Reinaerd'];
const yourLocation = [3.2145869436534724,51.19167462236231];
let routeLayer;

async function init() {
    console.log("Maps loaded");
    document.querySelector("#proximitychat").addEventListener("click", goToGeneralChat);
    createBasicMap();
    addProximityLayer();//draw the circle around the user that simulates the range of users
    addOtherLayers(fixedmarkercoords);//add the friend layers, other user layer
    addCheckboxEventListener();//activate filter feature
    document.addEventListener("dblclick", toggleFullScreen);
    document.addEventListener("dbltap", toggleFullScreen);
}

function goToGeneralChat(e){
    e.preventDefault();
    localStorage.setItem("currentchattype","public")
    location.replace("chatroom.html")
}

function createBasicMap(){
    let user = new ol.Feature({
        type:"marker",
        geometry: new ol.geom.Point(ol.proj.fromLonLat(yourLocation))
    })
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
    })
    maplayers["currentuserlayer"] = userLayer
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
    })
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
        })
    }
    let friendfeatures = [];
    let otheruserfeatures = [];
    let soundfeatures = [];
    for(let i = 0; i < 2; i++){
        friendfeatures.push(createMarkerFeature({longitude:arrayofcoords[i].longitude,latitude:arrayofcoords[i].latitude},"friend", dataNames[i]));
    }
    for(let i = 2; i < 5; i++){
        soundfeatures.push(createMarkerFeature({longitude:arrayofcoords[i].longitude,latitude:arrayofcoords[i].latitude},"sound", dataNames[i]));
    }
    for(let i = 5; i < 6; i++){
        otheruserfeatures.push(createMarkerFeature({longitude:arrayofcoords[i].longitude,latitude:arrayofcoords[i].latitude},"user", dataNames[i]));
    }
    
    let friendlayer = new ol.layer.Vector({
        source: new ol.source.Vector({features:friendfeatures}),
        style: new ol.style.Style({
            image: new ol.style.Icon({
                src: "./assets/images/friendicon.png",
                anchor: [0.5,1],
                scale: [0.09,0.09]
            })
        })
    })
    
    let otheruserslayer = new ol.layer.Vector({
        source: new ol.source.Vector({features:otheruserfeatures}),
        style: new ol.style.Style({
            image: new ol.style.Icon({
                src: "./assets/images/strangericon.png",
                anchor: [0.5,1],
                scale: [0.1,0.1]
            })
        })
    });
    let soundlayer = new ol.layer.Vector({
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

    let container = document.getElementById('popup');
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
        console.log(coordinate);
        console.log(ol.proj.transform([357608.4864928319, 6655135.270099361], 'EPSG:3857', 'EPSG:4326'));
        const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
            return feature;
        });
        if (feature && feature.A.type === "marker") {
            addPopupContent(feature);
            if(document.querySelector('.routeButton') !== null) findTheWay(feature);
            overlay.setPosition(coordinate);
        }else {
            overlay.setPosition(undefined);
            closer.blur();
        }
    });

}

function addPopupContent(feature){
    let content = document.getElementById('popup-content');
    const dataToUpperCase = feature.get('data').charAt(0).toUpperCase() + feature.get('data').slice(1);

    if(feature.A.data === "friend" || feature.A.data === "user") {
        content.innerHTML = '<p>' + feature.get('dataName') + '<br><span> ' + dataToUpperCase + '</span>' + '</p>'+
            '<br><button>Chat</button> <button class="routeButton" >Fastest route</button>';
    }
    else{
        content.innerHTML = '<p>' + feature.get('dataName') + '<br><span> ' + dataToUpperCase + '</span>'+ '</p>'+
             '<br><button>Mute</button> <button>See all noises</button>';
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
    maplayers["proximitylayer"] = proxlayer
    map.addLayer(proxlayer);
}

function addCheckboxEventListener(){
    let checkboxes = document.querySelectorAll("input[type=checkbox][name=filter]");
    let enabledFilters = []

    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change",() => {
            enabledFilters = Array.from(checkboxes).filter(i => i.checked).map(i => i.value)
            updateMapLayers(enabledFilters)
        })
    })
}

function updateMapLayers(enabledFilters){
    Object.values(maplayers).forEach(layer => map.removeLayer(layer))
    let maplayerstoapply = Object.assign({},maplayers)
    enabledFilters.forEach((filtervalue) => {
        delete maplayerstoapply[filtervalue];
    })
    Object.values(maplayerstoapply).forEach(layer => map.addLayer(layer))
}

function toggleFullScreen(){
    let map = document.querySelector("#map");
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

    const Layer = new ol.layer.Vector({
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
    })
    return Layer;
}

function findTheWay(feature){
    map.removeLayer(routeLayer);
    const endLonLat = ol.proj.transform(feature.A.geometry.flatCoordinates, 'EPSG:3857', 'EPSG:4326');
    console.log(endLonLat)
    document.querySelector('.routeButton').addEventListener("click", function(){
        console.log('clicked');

        getClosestRoute(yourLocation[0],
            yourLocation[1],endLonLat).then(response => {
            const{location, route} = response;
            routeLayer = drawRoute(route);
            map.addLayer(routeLayer);
        })
    });
}

async function getClosestRoute(startlong, startlat, endLonLat) {
    const API_KEY = '5b3ce3597851110001cf624814086a7454a5498e922d0f028ec7db66';
    const response = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}&start=${startlong},${startlat}&end=${endLonLat[0]},${endLonLat[1]}`);
    const result = await response.json();
    return {location: yourLocation, route: result.features[0]};
}

