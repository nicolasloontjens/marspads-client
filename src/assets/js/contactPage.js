"use strict";

document.addEventListener("DOMContentLoaded", init);

async function init() {
    let contacts = await getUserContacts();
    contacts.sort((a,b) => a.name.localeCompare(b.name));
    await insertContactsIntoHTML(contacts)
    document.querySelectorAll(".contactItem").forEach(item => {
        item.addEventListener("click", getSelectedContactName);
    });
    /*
    todo:
    add remove functionality
    */
    document.querySelector("#search").addEventListener("keyup", searchInputField);

}

async function insertContactsIntoHTML(contacts){
    //contacts = await filterContactsWithExistingChats(contacts)
    let chats = await getAllChats();
    chats = chats.map((chat) => chat.contactid)
    let contactswithchat = []
    let contactswithoutchats = await contacts.filter(function(contact){
        if(chats.includes(contact.contactid)){
            contactswithchat.push(contact)
        }
        return !chats.includes(contact.contactid)
    });
    console.log(contactswithoutchats)
    console.log(contactswithchat)
    contacts.forEach(contact => {
        if(chats.includes(contact.contactid)){
            document.querySelector("#ulContactList").innerHTML  += `<li><div id="${contact.contactid}">
                <a href="#" class="contactItem" data-contactName="${contact.name}">${contact.name}</a>
                <a href="#" class="contactoption-hidden">gotochat</a>
                </div>
            </li>`
        }
        document.querySelector("#ulContactList").innerHTML  += `<li><div id="${contact.contactid}" >
            <a href="#" class="contactItem" data-contactName="${contact.name}">${contact.name}</a>
            <a href="#" id="contactoption" class="contactoption-hidden">send chatrequest</a> 
            </div>
        </li>`
    })
}

function getSelectedContactName(e) {
    document.querySelectorAll("div #contactoption").forEach((elem) => {
        elem.setAttribute("class","contactoption-hidden")
    })
    let parentelem = e.target.parentElement
    parentelem.getElementsByTagName("a")[1].setAttribute("class","contactoption")
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
