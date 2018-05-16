import React, { Component } from "react";
import socketIOClient from "socket.io-client";
const socket = socketIOClient("http://localhost:3100");

export default class Notifications extends Component {
  notifyMe = () => {
    if (!("Notification" in window)) {
      alert("This browser does not support system notifications");
    } else if (Notification.permission === "granted") {
      socket.on("notify", data => {
        this.notify(data.type, data.username);
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(result => {
        if (result === "granted") {
          this.notify("granted", "You Will Receive Notifications");
        }
      });
    }
  };

  notify = (action, data) => {
    var notification;

    switch (action) {
      case "incoming-msg":
        notification = new Notification(action, {
          body: `${data} Sent You A Message`
        })
        break;
      case "granted":
        notification = new Notification(action, {
          body: data
        })
        break;
      case "friend-request":
        notification = new Notification(action, {
          body: `${data} Sent You A Friend Request`
        })
        break;
    }

    // if (action === "incoming-msg") {
    //   notification = new Notification(action, {
    //     body: `${data} Sent You A Message`
    //   });
    // } else if (action === "granted") {
    //   notification = new Notification(action, {
    //     body: data
    //   });
    // } else if (action === "friend-request") {
    //   notification = new Notification(action, {
    //     body: `${data} Sent You A Friend Request`
    //   });
    // }

    notification.onclick = function() {
      window.open("http://localhost:3000/dashboard");
    };
    setTimeout(notification.close.bind(notification), 3000);
  };

  render() {
    return <div>{this.notifyMe()}</div>;
  }
}
