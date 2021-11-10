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
        console.log(response.value)
    });
}

function logError(error) {
    console.log(error);
}

function call(request, successHandler, errorHandler) {
    fetch(request).then(successHandler).catch(errorHandler);
}

/*Our code:*/

function checkIfUserIDEmpty() {
    if (localStorage.getItem("User ID")) {
        if (checkOnServerIfIdExists()) {
            //get(`user/${getUserID}`);
            //get(`quotes/${getUserID()}`);
            fetch(`https://project-ii.ti.howest.be/mars-17/api/quotes/${getUserID()}`).then(response => response.json().then(data => {
                console.log(data)
            }));
        }
    } else {
        createNewUser();
        //console.log("User ID hasn't been set.");
    }

}

function getUserID() {
    return localStorage.getItem("User ID");
}

function createNewUser() {
    let newUserNumber = Math.floor(Math.random() * 100);

    localStorage.setItem("User ID", newUserNumber.toString());


    post(`user/${getUserID()}`)

}

function getUserInfo(id) {
    return get(`user/${id}`);
}

function getUserContact(id) {
    return get(`user/${id}/contacts`);
}

function addUserContact(contactID) {
    post(`user/${getUserID()}/contacts/add/${contactID}`);
}

function removeUserContact(contactID) {
    remove(`user/${getUserID()}/contacts/remove/${contactID}`)

}

function gitAllChats() { //get a list of all chatid's and their corresponding user
    get(`user/${getUserID()}/chats`)
}

//one not included!
function checkOnServerIfIdExists() {
    return true; //tijdelijk
}


