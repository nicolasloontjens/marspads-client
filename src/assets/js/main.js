let config;
let api;

document.addEventListener("DOMContentLoaded", init);

async function init() {
    //let page = window.location.pathname.split("/").pop();

    config = await loadConfig();
    api = `${config.host ? config.host + '/' : ''}${config.group ? config.group + '/' : ''}api/`;

    initUser();
    addNavRedirects();
    

}

async function loadConfig() {
    const response = await fetch("config.json");
    return response.json();
}

function addNavRedirects(){
    document.querySelector('#audioPage').addEventListener("click", () => {
        location.replace("audio.html");
    })
    document.querySelector("#settingsPage").addEventListener("click",()=>{
        location.replace("settings.html");
    })
    document.querySelector("#mapPage").addEventListener("click",()=>{
        location.replace("index.html");
    })
    document.querySelector("#contactsPage").addEventListener("click",()=>{
        location.replace("contacts.html");
    })
}