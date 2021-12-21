"use strict";

document.addEventListener("DOMContentLoaded", init);
let config = null;
let api = null;
let sendToServer = null;
const ulContactList = document.querySelector("#ulContactList");

async function init() {
    let contacts = await getUserContacts();
    contacts.sort((a,b) => a.name.localeCompare(b.name));
    config = await loadConfig();
    api = `${config.host ? config.host + '/' : ''}${config.group ? config.group + '/' : ''}api/`;
    await insertContactsIntoHTML(contacts);
    document.querySelector("#search").addEventListener("keyup", searchInputField);
    sendToServer = openSocket();
    document.querySelector("#back").addEventListener("click", () => {
        location.replace("index.html");
    });
    document.querySelector("#addfriend").addEventListener("click",displayAddFriendPopUp);
}

async function insertContactsIntoHTML(contacts){
    document.querySelector("ul").innerHTML = "";
    let chats = await getAllChats();
    const chatidscontactids = chats.map(chat => {
        return {contactid: chat.contactid,chatid:chat.chatid};
    });
    chats = chats.map((chat) => chat.contactid);
    contacts.forEach(contact => {
        if(chats.includes(contact.contactid)){
            let chatid = 0;
            chatidscontactids.forEach(object => {
                if(object["contactid"] === contact.contactid){
                    chatid = object["chatid"];
                }
            })
            document.querySelector("#ulContactList").innerHTML  += `<li><div id="${contact.contactid}">
                <a href="#" class="contactItem" data-contactName="${contact.name}">${contact.name}</a>
                <a href="#" class="contactoption-hidden" data-chatid="${chatid}" data-type="gotochat" data-optiontype="contactoption">Chat<br><img alt="go to chat icon" src="./assets/images/gotochaticon.png"></a>
                <a href="#" class="contactoption-hidden" data-contactid="${contact.contactid}" data-optiontype="contactoption">Remove contact<img alt="remove contact" src="./assets/images/removeicon.png"></a>
                </div>
            </li>`
        }else{
            sendRequest(contact);
        }
    });
    document.querySelectorAll(".contactItem").forEach(item => {
        item.addEventListener("click", getSelectedContactName);
    });
}

function sendRequest(contact){
    ulContactList.innerHTML += `<li><div id="${contact.contactid}" >
            <a href="#" class="contactItem" data-contactName="${contact.name}">${contact.name}</a>
            <a href="#" class="contactoption-hidden" data-contactid="${contact.contactid}" data-type="sendrequest" data-optiontype="contactoption">Send chat request<img alt="send chat request" src="./assets/images/sendrequesticon.png"></a>
            <a href="#" class="contactoption-hidden" data-contactid="${contact.contactid}" data-optiontype="contactoption">Remove contact<img alt="remove contact" src="./assets/images/removeicon.png"></a> 
            </div>
        </li>`
}

function goToChatInnerHtml(contact, chatid){
    ulContactList.innerHTML +=
        `<li><div id="${contact.contactid}">
                <a href="#" class="contactItem" data-contactName="${contact.name}">${contact.name}</a>
                <a href="#" class="contactoption-hidden" data-chatid="${chatid}" data-type="gotochat" data-optiontype="contactoption">Go to Chat</a>
                <a href="#" class="contactoption-hidden" data-contactid="${contact.contactid}" data-optiontype="contactoption">Remove contact</a>
                </div>
            </li>`
}

async function updateContacts(){
    let contacts = await getUserContacts();
    insertContactsIntoHTML(contacts);
}

function getSelectedContactName(e) {
    document.querySelectorAll('div a[data-optiontype="contactoption"]').forEach((elem) => {
        elem.setAttribute("class","contactoption-hidden");
        elem.parentElement.removeAttribute("clicked");
    });
    let parentelem = e.target.parentElement;
    parentelem.setAttribute("clicked","true");

    let action1 = parentelem.getElementsByTagName("a")[1];
    action1.setAttribute("class","contactoption");
    action1.addEventListener("click",goToChatOrSendChatRequest);
    let removecontact = parentelem.getElementsByTagName("a")[2];
    removecontact.setAttribute("class","contactoption");
    removecontact.addEventListener("click",removeContact);
}

function goToChatOrSendChatRequest(e){
    let todo = e.target.getAttribute("data-type");
    if(todo === "sendrequest"){
        //send chat request through sendtoserver
        let receiver = parseInt(e.target.getAttribute("data-contactid"));
        const data = {type: 'chatrequest', 'sendermid': parseInt(getMarsID()), 'receivercontactid': receiver, answer: 0};
        sendToServer(data);
    }else{
        //go to chatroom
        localStorage.setItem("currentchattype","private");
        localStorage.setItem("currentChatId",e.target.getAttribute("data-chatid"));
        location.replace("chatroom.html");
    }
}

function removeContact(e){
    e.preventDefault();
    removeUserContact(e.target.getAttribute("data-contactid"));

    setTimeout(function(){
        updateContacts();
    },1000);
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

function displayAddFriendPopUp(){
    document.querySelector("main").innerHTML += `
    <section id="popup">
        <a id="popup-closer" href="#">✖</a>
        <h2>Add friend</h2>
        <label for="addcontactid">
            <input type="number" placeholder="Enter contact id" name="addcontactid" id="addcontactid" autofocus>
        </label>
        <p id="popup-feedback"></p>
        <a href="" id="addcontact">Add contact</a>
    </section>`;
    document.querySelector("main").setAttribute("class","active");
    document.querySelector("header").setAttribute("class","active");
    document.querySelector("#addcontact").addEventListener("click",addFriend);
    document.querySelector("#popup-closer").addEventListener("click",closePopup);
}

function addFriend(e){
    e.preventDefault();
    let contactid = document.querySelector("#addcontactid").value;
    if(contactid !== ""){
        fetch(`https://project-ii.ti.howest.be/mars-17/api/user/${getMarsID()}/contacts/add/${contactid}`,{
            method: "POST"
        }).then(response => {
            if(response.ok){
                document.querySelector("#popup-feedback").innerHTML = `Success: Contact added`;
            }else{
                document.querySelector("#popup-feedback").innerHTML = `Error: Could not add contact`;
            }
        });
        document.querySelector("#addcontactid").value = "";
    }
}

function closePopup(e){
    e.preventDefault();
    document.querySelector("main section").remove();
    document.querySelector("main").removeAttribute("class");
    document.querySelector("header").removeAttribute("class");
    updateContacts();
}
