let statusCode;

function poc() {
    const messageBody = {
        "quote": "some quote"
    };

    get("quotes");
    get("quotes/1");
    post("quotes", messageBody);
    put("quotes/1", messageBody);

}

function get(uri, successHandler = logJson, failureHandler = logError) {
    const request = new Request(api + uri, {
        method: 'GET',
    });

    call(request, successHandler, failureHandler);
}

function post(uri, body, successHandler = logJson, failureHandler = logError) {
    const request = new Request(api + uri, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json;'
        },
        body: JSON.stringify(body)
    });

    call(request, successHandler, failureHandler);
}

function put(uri, body, successHandler = logJson, failureHandler = logError) {
    const request = new Request(api + uri, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json;'
        },
        body: JSON.stringify(body)
    });

    call(request, successHandler, failureHandler);
}

function remove(uri, successHandler = logJson, failureHandler = logError) {
    const request = new Request(api + uri, {
        method: 'DELETE',
    });

    call(request, successHandler, failureHandler);
}

function logJson(response) {
    response.json().then(response => {
        console.log(response.value);
    });
}

function logError(error) {
    console.log(error);
}

function call(request, successHandler, errorHandler) {
    fetch(request).then(successHandler).catch(errorHandler);
}

/*Our code:*/

function checkIfUserIDEmptyOrCreateNewUser() {
    if (localStorage.getItem("User ID")) {
        checkOnServerIfIdExistsOrCreateNewUser();

    }
}

function checkOnServerIfIdExistsOrCreateNewUser() {
    fetch(`https://project-ii.ti.howest.be/mars-17/api/user/${getUserID()}`).then(function (response) {
            //console.log(response.status);
            if (response.ok) {
                getUserInfo();
            } else {
                createNewUser();
                console.log("created new user.")
            }
        }
    )
}


function getUserID() {
    return localStorage.getItem("User ID");
}

function createNewUser() {
    const newUserNumber = Math.floor(Math.random() * 100); /* Will need to change!*/

    localStorage.setItem("User ID", newUserNumber.toString());

    post(`/create/${getUserID()}`);

}

function getUserInfo() {
    fetch(`https://project-ii.ti.howest.be/mars-17/api/user/${getUserID()}`).then(response => response.json().then(data => {
        console.log(data);
    }))
}

function getUserContacts() {
    fetch(`https://project-ii.ti.howest.be/mars-17/api/user/${getUserID()}/contacts`).then(response => response.json().then(data => {
        console.log(data);
    }))
}

function addUserContact(idToAdd) {
    post(`user/${getUserID()}/contacts/add/${idToAdd}`);
}

function removeUserContact(idToRemove) {
    remove(`user/${getUserID()}/contacts/remove/${idToRemove}`);

}

function getAllChats() { //get a list of all chatid's and their corresponding user
    fetch(`https://project-ii.ti.howest.be/mars-17/api/user/${getUserID()}/chats`).then(response => response.json().then(data => {
        console.log(data);
    }))

}

function getAllChatsWithUser(userId) {
    fetch(`https://project-ii.ti.howest.be/mars-17/api/user/${getUserID()}/chats/${userId}`).then(response => response.json().then(data => {
        console.log(data);
    }))

}

/*

 fetch(`https://project-ii.ti.howest.be/mars-17/api/user/${getUserID()}`).then(response => response.json().then(data => {
     console.log(data.status);
 }));
*/