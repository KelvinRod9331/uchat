import React, { Component } from "react";
// import dateFormat from 'dateformat';
import "./SingleMessage.css";

const SingleMessage = ({ message, currentUser, contact, sendingMessages, receivingMessages }) => {
  console.log('Single Message', message, currentUser)
  const messageClass =
    contact.username === currentUser.username
      ? "currentUserMessage"
      : "otherUserMessage";

  return (
    <div className={messageClass}>
      <div className="message-header">
        {/* <div className="message-date">{dateFormat(message.date_sent)}</div> */}
        <div className="message-sender">{message.sender_message}</div>
      </div>
      <div className="message-body-container">
        <div className="message-body-content">{message.receiver_message}</div>
      </div>
    </div>
  );
};

export default SingleMessage;