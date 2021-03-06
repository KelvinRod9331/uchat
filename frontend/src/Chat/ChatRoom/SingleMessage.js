/* eslint-disable */
import React, { Component } from "react";
import "./SingleMessage.css";

const SingleMessage = ({ threadMessages, currentUser, contact, sendingMessages, receivingMessages }) => {
  
  return threadMessages.map(messenger => {
    if (currentUser.id === messenger.sender_id) {
      return (
        <div className={"currentUserMessage"}>
          <div className="message-header">
            <div className="message-sender">{currentUser.username}</div>
            <div className="message-date">{messenger.date_sent}</div>
          </div>
          <div className="message-body-container">
            <div className="message-body-content">{messenger.sender_message}</div>
          </div>
        </div>
      );
      
    } else if (currentUser.id === messenger.receiver_id) {
        return (
          <div className={"otherUserMessage"}>
            <div className="message-header">
              <div className="message-sender">{contact.username}</div>
              <div className="message-date">{messenger.date_sent}</div>
            </div>
            <div className="message-body-container">
              <div className="message-body-content">{messenger.receiver_message}</div>
            </div>
          </div>
        );
    }
  });

};

export default SingleMessage;

