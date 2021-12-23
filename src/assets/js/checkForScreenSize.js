"use strict";

document.addEventListener("DOMContentLoaded", init);

async function init() {

    window.addEventListener("resize", checkForScreenSize);
    checkForScreenSize();

}

function checkForScreenSize() {

    let path = document.location.pathname;
    let page = path.split("/").pop();

    setTimeout(function () {
        if (checkForMobileOrDesktop != "mobile") {
            if (page.toLowerCase() === "chatroom.html" || page.toLowerCase() === "contacts.html") {
                if (window.innerHeight < 2100) {
                    new Notification("Please change screen size to IPhoneX (Portrait mode)", {
                        icon: "./assets/images/MarsPads-logo.png"
                    });
                }
            } else {
                if (window.innerWidth !== 980 || window.innerHeight !== 453) {
                    new Notification("Please change screen size to IPhoneX (Landscape mode)", {
                        icon: "./assets/images/MarsPads-logo.png"
                    });
                }
            }
        }
    }, 3000);
}

function checkForMobileOrDesktop() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return "mobile";
    } else {
        return "not mobile";
    }
}