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
        const chattername = await loadChatInfo();
        document.querySelector("#username").innerHTML += `<p>${chattername}</p>`
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
    response.forEach(message => {
        let timestamp = message.timestamp;
        timestamp = timestamp.substring(0,(timestamp.length-7))
        document.querySelector("#messages").insertAdjacentHTML("beforeend",`<p class="chatMessage">${message.name} @ ${timestamp}: ${message.content}</p>`)
    })
}

async function loadChatInfo(){
    const response = await getAllChats();
    let currentChatId = localStorage.getItem("currentChatId")
    currentChatId = parseInt(currentChatId)
    let result;
    response.forEach(chat => {
        if(chat.chatid === currentChatId){
            result = chat;
        }
    })
    return result.username;
}