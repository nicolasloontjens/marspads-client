let config;
let api;
const VAPID_PUBLIC_KEY = "BDTYe4PbcJ4UuSl3kQCv7zjoy1eUXbN3ul3mhMk7KY5oBI7p0NBfLSFcn-Y-dU8SpqHUW60vAD8ehW_klnwyM7c";
let sendToServer = null;

document.addEventListener("DOMContentLoaded", init);

async function init() {

    config = await loadConfig();
    api = `${config.host ? config.host + '/' : ''}${config.group ? config.group + '/' : ''}api/`;

    initUser();

    sendToServer = openSocket();
    Notification.requestPermission((status)=>{
        registerPush();
    });
    if('serviceWorker' in navigator){
        navigator.serviceWorker.register("./sw.js",{
            Scope: '/'
        }).catch(function(err){
            console.log("error registering worker: ", err);
        });
    }
}

function registerPush(){
    if('PushManager' in window){
        navigator.serviceWorker.ready.then(registration => {
            const subscribeOptions = {
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            };
            return registration.pushManager.subscribe(subscribeOptions);
        }).then(pushSubscription => {
            setTimeout(function(){
                registerUser(pushSubscription);
            },3000);//wait until user has definitely been generated and eventbus is ready
        });
    }
}

function registerUser(pushSubscription){
    const mid = JSON.parse(localStorage.getItem("user")).marsid;
    sendToServer({"type":"subscription","marsid": mid, "subscription":pushSubscription});
}

async function loadConfig() {
    const response = await fetch("config.json");
    return response.json();
}

//helper function for registering push notifications
function urlBase64ToUint8Array (base64String){
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
