"use strict";

document.addEventListener("DOMContentLoaded",init);

function init(){
    localStorage.setItem("currentchattype","public")
}

const CHNL_TO_SERVER = "events.to.server";
const EVENTBUS_PATH = "https://project-ii.ti.howest.be/mars-17/events";
const CHNL_TO_CLIENTS_BROADCAST = "events.to.clients";
/*
const CHNL_TO_CLIENT_MULTICAST = "events.to.clients.1"
const CHNL_TO_CLIENT_UNICAST = "events.to.clients.mid." + localStorage.getItem("unimid");
*/

function openSocket() {
	console.log(EVENTBUS_PATH)
	let eb = new EventBus(EVENTBUS_PATH);

	function sendToServer(message) {
		eb.send(CHNL_TO_SERVER, message);
	}

	eb.onopen = function() {
		eb.registerHandler(CHNL_TO_CLIENTS_BROADCAST, onPublicMessage);
        /*
		eb.registerHandler(CHNL_TO_CLIENT_MULTICAST, onMessage);
		eb.registerHandler(CHNL_TO_CLIENT_UNICAST, onRequest);
        */
	};

	return sendToServer;
}

function onPublicMessage(error, message) {
	document.querySelector("#messages").innerHTML +=
		`   <p class="chatMessage">
                ${message.body}
			</p>
		`;

    if (error) {
        console.error(error);
    }
}
/*
function onRequest(error, message){
	console.log(message);
	if(message.body.hasOwnProperty("chatid")){
		localStorage.setItem("currentChatId",message.body.chatid);
		location.replace("index.html")
	}
	
}
*/