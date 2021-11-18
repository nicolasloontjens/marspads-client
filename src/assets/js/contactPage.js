"use strict";

document.addEventListener("DOMContentLoaded", init);

async function init() {
    document.querySelectorAll(".contactItem").forEach(item => {
        item.addEventListener("click", getSelectedContactName);
    });

    document.querySelector("#search").addEventListener("keyup", searchInputField);

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
