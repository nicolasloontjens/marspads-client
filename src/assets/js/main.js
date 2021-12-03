let config;
let api;

document.addEventListener("DOMContentLoaded", init);

async function init() {
    //let page = window.location.pathname.split("/").pop();

    config = await loadConfig();
    api = `${config.host ? config.host + '/' : ''}${config.group ? config.group + '/' : ''}api/`;

    initUser();
    addNavRedirects();
    document.querySelector('#arrowNav').addEventListener('click', MakeNavigationRetract);


}

async function loadConfig() {
    const response = await fetch("config.json");
    return response.json();
}

function addNavRedirects(){
    document.querySelector('#audioPage').addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        location.replace("audio.html");
    })
    document.querySelector("#settingsPage").addEventListener("click",(e)=>{
        e.stopPropagation();
        e.preventDefault();
        location.replace("settings.html");
    })
    document.querySelector("#mapPage").addEventListener("click",(e)=>{
        e.stopPropagation();
        e.preventDefault();
        location.replace("index.html");
    })
    document.querySelector("#contactsPage").addEventListener("click",(e)=>{
        e.stopPropagation();
        e.preventDefault();
        location.replace("contacts.html");
    })
}

function MakeNavigationRetract(e) {
    e.preventDefault();
    document.querySelector('main aside nav').classList.toggle('hidden');
}