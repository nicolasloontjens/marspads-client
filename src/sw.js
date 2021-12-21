let msg;
let jsonmessage;

self.addEventListener("push", event => { // NOSONAR
    msg = event.data.text();
    jsonmessage = JSON.parse(msg);
    self.registration.showNotification(jsonmessage.sendername + " has sent you a chat request!",{
      icon: './assets/images/MarsPads-logo.png'
    });
});

self.addEventListener('notificationclick', function(e) { // NOSONAR
    let notification = e.notification;
    let action = e.action;
    if (action === 'close') {
      notification.close();
    }else{
      jsonmessage.answer = 1;
      self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage({"msg": jsonmessage}));
      });
      notification.close();
    }
});
