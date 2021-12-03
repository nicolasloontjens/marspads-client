"use strict";

document.addEventListener("DOMContentLoaded", init);

async function init() {
    let contacts = await getUserContacts();
    contacts.sort((a,b) => a.name.localeCompare(b.name));
    console.log(await getAllChats())
    insertContactsIntoHTML(contacts)
    document.querySelectorAll(".contactItem").forEach(item => {
        item.addEventListener("click", getSelectedContactName);
    });
    /*
    todo:
    filter contacts if they have a chat already
    add remove functionality
    */
    document.querySelector("#search").addEventListener("keyup", searchInputField);

}

function insertContactsIntoHTML(contacts){
    

    contacts.forEach(contact => {
        document.querySelector("#ulContactList").innerHTML  += `<li><a href="#" class="contactItem" data-contactName="${contact.name}">${contact.name}</a></li>`
    })
}

function getSelectedContactName(e) {
    const contactName = e.target.getAttribute("data-contactName");
    console.log(contactName);
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
