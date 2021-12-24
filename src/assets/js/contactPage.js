"use strict";

document.addEventListener("DOMContentLoaded", init);
let config = null;
let api = null;
let sendToServer = null;
const ulContactList =  "#ulContactList";

async function init() {
    let contacts = await getUserContacts();
    contacts = contacts.sort((a, b) => a.name.localeCompare(b.name));
    config = await loadConfig();
    api = `${config.host ? config.host + '/' : ''}${config.group ? config.group + '/' : ''}api/`;
    await insertContactsIntoHTML(contacts);
    document.querySelector("#search").addEventListener("keyup", searchInputField);
    sendToServer = openSocket();
    document.querySelector("#back").addEventListener("click", () => {
        location.replace("index.html");
    });
    document.querySelector("#addfriend").addEventListener("click", displayAddFriendPopUp);
    document.querySelector(ulContactList).addEventListener("click", triggerHandler);
}

function triggerHandler(e) {
    if (e.target.className.toLowerCase() === "contact" || e.target.className.toLowerCase() === "contactitem") {
        getSelectedContactName(e);
    }
}

async function insertContactsIntoHTML(contacts) {
    document.querySelector("ul").innerHTML = "";
    let chats = await getAllChats();
    const chatidscontactids = chats.map(chat => {
        return {contactid: chat.contactid, chatid: chat.chatid};
    });
    chats = chats.map((chat) => chat.contactid);
    contacts.forEach(contact => {
        if (chats.includes(contact.contactid)) {
            let chatid = 0;
            chatidscontactids.forEach(object => {
                if (object["contactid"] === contact.contactid) {
                    chatid = object["chatid"];
                }
            });
            document.querySelector(ulContactList).innerHTML += `<li><div id="${contact.contactid}" class="contact">
                <a href="#" class="contactItem" data-contactName="${contact.name}">${contact.name}</a>
                <a href="#" class="contactoption-hidden" data-chatid="${chatid}" data-type="gotochat" data-optiontype="contactoption">Chat<br><img alt="go to chat icon" src="./assets/images/gotochaticon.png"></a>
                <a href="#" class="contactoption-hidden" data-contactid="${contact.contactid}" data-optiontype="contactoption">Remove contact<br><img alt="remove contact" src="./assets/images/removeicon.png"></a>
                </div>
            </li>`;
        } else {
            document.querySelector(ulContactList).innerHTML += `<li><div id="${contact.contactid}" class="contact" >
            <a href="#" class="contactItem" data-contactName="${contact.name}">${contact.name}</a>
            <a href="#" class="contactoption-hidden" data-contactid="${contact.contactid}" data-type="sendrequest" data-optiontype="contactoption">Send chat request<br><img alt="send chat request" src="./assets/images/sendrequesticon.png"></a>
            <a href="#" class="contactoption-hidden" data-contactid="${contact.contactid}" data-optiontype="contactoption">Remove contact<br><img alt="remove contact" src="./assets/images/removeicon.png"></a> 
            </div>
        </li>`;
        }
    });
}

async function updateContacts() {
    const contacts = await getUserContacts();
    insertContactsIntoHTML(contacts);
}

function getSelectedContactName(e) {

    document.querySelectorAll('div a[data-optiontype="contactoption"]').forEach((elem) => {
        elem.setAttribute("class", "contactoption-hidden");
    });

    if (e.target.className.toLowerCase() === "contactitem") {
        return openContact(e.target.parentElement);
    } else {
        return openContact(e.target);
    }
}

function openContact(parentelem) {
    document.querySelectorAll(`${ulContactList} div`).forEach(elem => {
        elem.setAttribute("class","contact");
    });
    parentelem.classList.add("contactSlideOpen");
    const action1 = parentelem.getElementsByTagName("a")[1];
    action1.setAttribute("class", "contactoption");
    action1.addEventListener("click", goToChatOrSendChatRequest);
    const removecontact = parentelem.getElementsByTagName("a")[2];
    removecontact.setAttribute("class", "contactoption");
    removecontact.addEventListener("click", removeContact);
}


function goToChatOrSendChatRequest(e) {
    const todo = e.currentTarget.getAttribute("data-type");
    if (todo === "sendrequest") {
        //send chat request through sendtoserver
        const receiver = parseInt(e.currentTarget.getAttribute("data-contactid"));
        const data = {
            type: 'chatrequest',
            'sendermid': parseInt(getMarsID()),
            'receivercontactid': receiver,
            answer: 0
        };
        sendToServer(data);
        const notification = new Notification("Request has been sent!", { // NOSONAR
            icon: "./assets/images/MarsPads-logo.png"
        });
    } else {
        //go to chatroom
        localStorage.setItem("currentchattype", "private");
        localStorage.setItem("currentChatId", e.currentTarget.getAttribute("data-chatid"));
        location.replace("chatroom.html");
    }
}

function removeContact(e) {
    e.preventDefault();
    removeUserContact(e.currentTarget.getAttribute("data-contactid"));

    setTimeout(function () {
        updateContacts();
    }, 1000);
}

function searchInputField() {
    let a;
    let i;
    let txtValue;
    const input = document.querySelector("#search");
    const filter = input.value.toUpperCase();
    const ul = document.querySelector(ulContactList);
    const li = ul.getElementsByTagName("li");
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

function displayAddFriendPopUp() {
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
    document.querySelector("main").setAttribute("class", "active");
    document.querySelector("header").setAttribute("class", "active");
    document.querySelector("#addcontact").addEventListener("click", addFriend);
    document.querySelector("#popup-closer").addEventListener("click", closePopup);
}

function addFriend(e) {
    e.preventDefault();
    const contactid = document.querySelector("#addcontactid").value;
    let owncontactid = localStorage.getItem("user");
    owncontactid = JSON.parse(owncontactid).contactid + "";
    if (contactid !== "" && contactid !== owncontactid) {
        fetch(`https://project-ii.ti.howest.be/mars-17/api/user/${getMarsID()}/contacts/add/${contactid}`, {
            method: "POST"
        }).then(response => {
            if (response.ok) {
                document.querySelector("#popup-feedback").innerHTML = `Success: Contact added`;
            } else {
                document.querySelector("#popup-feedback").innerHTML = `Error: Could not add contact`;
            }
        });
        document.querySelector("#addcontactid").value = "";
    }
}

function closePopup(e) {
    e.preventDefault();
    document.querySelector("main section").remove();
    document.querySelector("main").removeAttribute("class");
    document.querySelector("header").removeAttribute("class");
    location.reload(true);
}
