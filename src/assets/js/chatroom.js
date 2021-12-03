"use strict";
let sendToServer = null;
document.addEventListener("DOMContentLoaded",init);

function init(){
    sendToServer = openSocket();
    if(localStorage.getItem("currentchattype")==="public"){
        document.querySelector("#send-button").addEventListener("click",sendPublicMessage);
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