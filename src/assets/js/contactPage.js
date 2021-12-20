"use strict";

document.addEventListener("DOMContentLoaded", init);
let config = null;
let api = null;
let sendToServer = null;

async function init() {
    let contacts = await getUserContacts();
    contacts.sort((a,b) => a.name.localeCompare(b.name));
    config = await loadConfig();
    api = `${config.host ? config.host + '/' : ''}${config.group ? config.group + '/' : ''}api/`;
    await insertContactsIntoHTML(contacts)
    document.querySelector("#search").addEventListener("keyup", searchInputField);
    sendToServer = openSocket()
}

async function insertContactsIntoHTML(contacts){
    document.querySelector("ul").innerHTML = ""
    let chats = await getAllChats();
    let chatidscontactids = chats.map(chat => {return {contactid: chat.contactid,chatid:chat.chatid}})
    chats = chats.map((chat) => chat.contactid)
    contacts.forEach(contact => {
        if(chats.includes(contact.contactid)){
            let chatid = 0
            chatidscontactids.forEach(object => {
                if(object["contactid"] === contact.contactid){
                    chatid = object["chatid"]
                }
            })
            document.querySelector("#ulContactList").innerHTML  += `<li><div id="${contact.contactid}">
                <a href="#" class="contactItem" data-contactName="${contact.name}">${contact.name}</a>
                <a href="#" type="contactoption" class="contactoption-hidden" data-chatid="${chatid}" data-type="gotochat">Go to Chat</a>
                <a href="#" type="contactoption" class="contactoption-hidden" data-contactid="${contact.contactid}">Remove contact</a>
                </div>
            </li>`
        }else{
            document.querySelector("#ulContactList").innerHTML  += `<li><div id="${contact.contactid}" >
            <a href="#" class="contactItem" data-contactName="${contact.name}">${contact.name}</a>
            <a href="#" type="contactoption" class="contactoption-hidden" data-contactid="${contact.contactid}" data-type="sendrequest">Send chat request</a>
            <a href="#" type="contactoption" class="contactoption-hidden" data-contactid="${contact.contactid}">Remove contact</a> 
            </div>
        </li>`
        }
    })
    document.querySelectorAll(".contactItem").forEach(item => {
        item.addEventListener("click", getSelectedContactName);
    });
}

async function updateContacts(){
    let contacts = await getUserContacts();
    insertContactsIntoHTML(contacts)
}

function getSelectedContactName(e) {
    document.querySelectorAll('div a[type="contactoption"]').forEach((elem) => {
        elem.setAttribute("class","contactoption-hidden")
        elem.parentElement.removeAttribute("clicked")
    })
    let parentelem = e.target.parentElement
    parentelem.setAttribute("clicked","true")

    let action1 = parentelem.getElementsByTagName("a")[1]
    action1.setAttribute("class","contactoption")
    action1.addEventListener("click",goToChatOrSendChatRequest)
    let removecontact = parentelem.getElementsByTagName("a")[2]
    removecontact.setAttribute("class","contactoption")
    removecontact.addEventListener("click",removeContact)
}

function goToChatOrSendChatRequest(e){
    let todo = e.target.getAttribute("data-type");
    if(todo === "sendrequest"){
        //send chat request through sendtoserver
        let receiver = parseInt(e.target.getAttribute("data-contactid"));
        const data = {type: 'chatrequest', 'sendermid': parseInt(getMarsID()), 'receivercontactid': receiver, answer: 0};
        sendToServer(data)
    }else{
        //go to chatroom
        localStorage.setItem("currentchattype","private");
        localStorage.setItem("currentChatId",e.target.getAttribute("data-chatid"))
        location.replace("chatroom.html")
    }
}

function removeContact(e){
    e.preventDefault();
    removeUserContact(e.target.getAttribute("data-contactid"));

    setTimeout(function(){
        updateContacts();
    },1000)
        
}

function searchInputField() {
    let input, filter, ul, li, a, i, txtValue;
    input = document.querySelector("#search");
    filter = input.value.toUpperCase();
    ul = document.querySelector("#ulContactList");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

async function loadConfig() {
    const response = await fetch("config.json");
    return response.json();
}
