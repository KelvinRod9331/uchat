import React, { Component } from "react";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import socketIOClient from "socket.io-client";

const socket = socketIOClient("http://localhost:3100");

export default class Notifications extends React.Component {
  createNotification = () => {
    socket.on("notify", data => {
      console.log("notify fired and received data", data);
      return () => {
        switch (data.type) {
          case "incoming-message":
            return NotificationManager.info(
              `${data.username} sent you a message`
            );
            break;
          case "friend-request":
            NotificationManager.success(
              `${data.username} sent you a friend request`
            );
            break;
          case "warning":
            NotificationManager.warning(
              "Warning message",
              "Close after 3000ms",
              3000
            );
            break;
          case "error":
            NotificationManager.error(
              "Error message",
              "Click me!",
              5000,
              () => {
                alert("callback");
              }
            );
            break;
        }
      };
    });
  };

  render() {
    return (
      <div>
        <NotificationContainer />
        {this.createNotification()}
      </div>
    );
  }
}
