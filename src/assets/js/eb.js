"use strict";

document.addEventListener("DOMContentLoaded",init);

function init(){
	if ('serviceWorker' in navigator) {
	navigator.serviceWorker.addEventListener('message', (message) => {
		let obj = message.data.msg
		obj.receivercontactid = JSON.parse(localStorage.getItem("user")).contactid
		console.log(obj)
		if(obj.answer != 0){
			sendToServer(obj);
		}
	})
}
}

const CHNL_TO_SERVER = "events.to.server";
const EVENTBUS_PATH = "https://project-ii.ti.howest.be/mars-17/events";
const CHNL_TO_CLIENTS_BROADCAST = "events.to.clients";
const CHNL_TO_CLIENT_MULTICAST = "events.to.clients." + localStorage.getItem("currentChatId");
const CHNL_TO_CLIENT_UNICAST = "events.to.clients.mid." + JSON.parse(localStorage.getItem("user")).marsid


function openSocket() {
	console.log(EVENTBUS_PATH)
	let eb = new EventBus(EVENTBUS_PATH);

	function sendToServer(message) {
		eb.send(CHNL_TO_SERVER, message);
	}

	eb.onopen = function() {
		eb.registerHandler(CHNL_TO_CLIENTS_BROADCAST, onPublicMessage);
		eb.registerHandler(CHNL_TO_CLIENT_MULTICAST, onPrivateMessage);
		eb.registerHandler(CHNL_TO_CLIENT_UNICAST, onRequest);
	};

	return sendToServer;
}

function onPublicMessage(error, message) {
	if(document.querySelector("main").getAttribute("id") === "chatroom"){
		if(localStorage.getItem("currentchattype") === "public"){
			document.querySelector("#messages").innerHTML +=
			`   <p class="chatMessage">
					${message.body}
				</p>
			`;
	
		if (error) {
			console.error(error);
		}
		}
	}
}

function onPrivateMessage(error, message){
	if(document.querySelector("main").getAttribute("id") === "chatroom"){
		if(localStorage.getItem("currentchattype") === "private"){
			document.querySelector("#messages").innerHTML +=
			`   <p class="chatMessage">
					${message.body}
				</p>
			`;
		}
	}
}

function onRequest(error, message){
	console.log(message);
	if(message.body.hasOwnProperty("chatid")){
		localStorage.setItem("currentChatId",message.body.chatid);
		localStorage.setItem("currentchattype","private");
		location.replace("chatroom.html")
	}
}
