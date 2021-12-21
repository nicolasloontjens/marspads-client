let statusCode;

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

async function initUser() {
    if (localStorage.getItem("user")===null) {
        await createUser();
    }
    getUserContacts();
}

async function createUser(){
    const userid = Math.floor(Math.random() * 1000000)+1;
    fetch(`https://project-ii.ti.howest.be/mars-17/api/create/${userid}`,{
        method: "POST"
    }).then(response => response.json()).then(json => {
        if(json.status === 500){
            createUser();
        }
        localStorage.setItem("user",JSON.stringify(json));
    });
    await new Promise(resolve => setTimeout(resolve, 600))
}

function getMarsID(){
    return JSON.parse(localStorage.getItem("user")).marsid
}

async function getUserContacts() {
    try{
        const api_response = await fetch(`https://project-ii.ti.howest.be/mars-17/api/user/${getMarsID()}/contacts`);
        return await api_response.json();
       
    }catch(error){
        console.log(error);
        return false;
    }
    
}

function addUserContact(idToAdd) {
    post(`user/${getMarsID()}/contacts/add/${idToAdd}`);
}

function removeUserContact(idToRemove) {
    fetch(`https://project-ii.ti.howest.be/mars-17/api/user/${getMarsID()}/contacts/remove/${idToRemove}`,{
        method: 'DELETE'
    });
}

async function getAllChats() { //get a list of all chatid's and their corresponding user
    try{
        const api_resp = await fetch(`https://project-ii.ti.howest.be/mars-17/api/user/${getMarsID()}/chats`)
        return await api_resp.json();
    }catch(error){
        console.log(error);
        return false;
    }
}

async function getAllChatsWithUser(chatid) {
    try{
        const api_response = await fetch(`https://project-ii.ti.howest.be/mars-17/api/user/${getMarsID()}/chats/${chatid}`);
        return await api_response.json();
    }catch(error){
        console.log(error);
        return false;
    }
}
