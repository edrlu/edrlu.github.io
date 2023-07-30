function notification_api() {
  if (!Notification) {
    alert('Notification!'); 
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();

  var notification = new Notification('Welcome', {
    icon: 'https://a.disquscdn.com/uploads/users/1360/1267/avatar92.jpg?1426693178',
    body: "Greetings from Joash!",
  });

  notification.onclick = function () {
    window.open("http://joashpereira.com/");      
  };
}