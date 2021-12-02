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
    response.json().then(console.log);
}

function logError(error) {
    console.log(error);
}

function call(request, successHandler, errorHandler) {
    fetch(request).then(successHandler).catch(errorHandler);
}

/*Our code:*/

function initUser() {
    if (localStorage.getItem("user")===null) {
        createUser();
    }
    getUserContacts();
    
}

function createUser(){
    let userid = Math.floor(Math.random() * 1000000)+1;
    fetch(`https://project-ii.ti.howest.be/mars-17/api/create/${userid}`,{
        method: "POST"
    }).then(response => response.json()).then(json => {
        if(json.status === 500){
            createUser();
        }
        console.log(json);
        localStorage.setItem("user",JSON.stringify(json))
    });
}

function getMarsID(){
    return JSON.parse(localStorage.getItem("user")).marsid
}

function getUserContacts() {
    fetch(`https://project-ii.ti.howest.be/mars-17/api/user/${getMarsID()}/contacts`).then(userContacts => userContacts.json().then(data => {
        console.log(data);
    }));
}

function addUserContact(idToAdd) {
    post(`user/${getMarsID()}/contacts/add/${idToAdd}`);
}

function removeUserContact(idToRemove) {
    remove(`user/${getMarsID()}/contacts/remove/${idToRemove}`);
}

function getAllChats() { //get a list of all chatid's and their corresponding user
    fetch(`https://project-ii.ti.howest.be/mars-17/api/user/${getMarsID()}/chats`).then(allChats => allChats.json().then(data => {
        console.log(data);
    }));
}

function getAllChatsWithUser(chatid) {
    fetch(`https://project-ii.ti.howest.be/mars-17/api/user/${getMarsID()}/chats/${chatid}`).then(data => data.json().then(messages => {
        console.log(messages);
    }));
}
