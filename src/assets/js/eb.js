"use strict";

document.addEventListener("DOMContentLoaded", init);

let CHNL_TO_CLIENT_MULTICAST;
let CHNL_TO_CLIENT_UNICAST;

async function init() {
    await initUser();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (message) => {
            const obj = message.data.msg;
            obj.receivercontactid = JSON.parse(localStorage.getItem("user")).contactid;
            if (obj.answer !== 0) {
                sendToServer(obj);
            }
        });
    }
    CHNL_TO_CLIENT_MULTICAST = "events.to.clients." + localStorage.getItem("currentChatId");
    CHNL_TO_CLIENT_UNICAST = "events.to.clients.mid." + JSON.parse(localStorage.getItem("user")).marsid;
}

const CHNL_TO_SERVER = "events.to.server";
const EVENTBUS_PATH = "https://project-ii.ti.howest.be/mars-17/events";
const CHNL_TO_CLIENTS_BROADCAST = "events.to.clients";


function openSocket() {
    let eb = new EventBus(EVENTBUS_PATH);

    function sendToServer(message) {
        eb.send(CHNL_TO_SERVER, message);
    }

    eb.onopen = function () {
        eb.registerHandler(CHNL_TO_CLIENTS_BROADCAST, onPublicMessage);
        eb.registerHandler(CHNL_TO_CLIENT_MULTICAST, onPrivateMessage);
        eb.registerHandler(CHNL_TO_CLIENT_UNICAST, onRequest);
    };

    return sendToServer;
}

function onPublicMessage(error, message) {
    if (document.querySelector("main").getAttribute("id") === "chatroom") {
        if (localStorage.getItem("currentchattype") === "public") {

            const today = new Date();
            const timestamp = `${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}`;
            insertChatMessageIntoHTML(message.body, timestamp, "")
        }
    }
    if (error) {
        console.error(error);
    }
}

function onPrivateMessage(error, message) {
    if (document.querySelector("main").getAttribute("id") === "chatroom") {
        if (localStorage.getItem("currentchattype") === "private") {
            const today = new Date();
            const timestamp = `${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}`;

            const user = message.body.split(":")[0];
            let owner = localStorage.getItem("user")
            owner = JSON.parse(owner)
            if (`${user}` === owner.name) {
                insertChatMessageIntoHTML(message.body, timestamp, "owner")//test insertChatMessageIntoHTML(res, "owner")
            } else {
                insertChatMessageIntoHTML(message.body, timestamp, "friend")
            }
        }
    }
    if (error) {
        console.error(error);
    }
}

function insertChatMessageIntoHTML(messagebody, timestamp, htmlclass) {

    const user = messagebody.split(":")[0];
    const actualmessage = messagebody.split(":")[1];

    //const res = `${user} @ ${timestamp}: ${actualmessage}`;


    document.querySelector("#messages").insertAdjacentHTML("afterbegin",
        `<div class="chatMessage ${htmlclass}">
			<p> ${user} </p> <p> ${actualmessage} </p> <p> ${timestamp} </p> 
		</div>`);
}

function onRequest(error, message) {
    if (message !== undefined && message.body.hasOwnProperty("chatid")) {
        localStorage.setItem("currentChatId", message.body.chatid);
        localStorage.setItem("currentchattype", "private");
        location.replace("chatroom.html");
    }
}
