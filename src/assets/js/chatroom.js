"use strict";
let sendToServer = null;
document.addEventListener("DOMContentLoaded",init);

async function init(){
    sendToServer = openSocket();
    if(localStorage.getItem("currentchattype")==="public"){
        document.querySelector("#send-button").addEventListener("click",sendPublicMessage);
    }else if(localStorage.getItem("currentchattype")==="private"){
        //get chatmessages from server and display them
        await loadPrivateChatMessages();
        document.querySelector("#send-button").addEventListener("click",sendPrivateMessage);
    }
}

function sendPublicMessage(e){
    e.preventDefault();
    const message = document.querySelector("#chat-message").value;
    if(message != ""){
        let user = JSON.parse(localStorage.getItem("user"))
        const data = {type: 'message',marsid:user.marsid,"message": message}
        sendToServer(data)
        document.querySelector("#chat-message").value = "";
    }
}

function sendPrivateMessage(e){
    e.preventDefault();
    const message = document.querySelector("#chat-message").value;
    if(message != ""){
        let user = JSON.parse(localStorage.getItem("user"));
        let chatid = JSON.parse(localStorage.getItem("currentChatId"))
        const data = {type:"privatemessage", "chatid":chatid, marsid: user.marsid, message: message}
        sendToServer(data);
        document.querySelector("#chat-message").value = "";
    }
}

async function loadPrivateChatMessages(){
    const response = await getAllChatsWithUser(localStorage.getItem("currentChatId"))
}