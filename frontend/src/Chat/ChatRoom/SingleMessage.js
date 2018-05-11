import React, { Component } from "react";
// import dateFormat from 'dateformat';
import "./SingleMessage.css";

const SingleMessage = ({ threadMessages, currentUser, contact, sendingMessages, receivingMessages }) => {
  console.log('Single Message', threadMessages, currentUser)
  let currentUserMessages = {}
  let otherUserMessages = {}
  
  threadMessages.forEach(messenger => {
    if (currentUser.id === messenger.receiver_id) {
      currentUserMessages.message = messenger.receiver_messages
      currentUserMessages.username = currentUser.username
    } else if (currentUser.id === messenger.sender_id) {
      currentUserMessages.message = messenger.sender_messages
      otherUserMessages.username = contact.username
    }
  });
  
      if(contact.username === currentUser.username){
     return (<div className={"currentUserMessage"}>
        <div className="message-header">
          {/* <div className="message-date">{dateFormat(message.date_sent)}</div> */}
          <div className="message-sender">{currentUserMessages.username}</div>
        </div>
        <div className="message-body-container">
          <div className="message-body-content">{currentUserMessages.message}</div>
        </div>
      </div>)
      }
      else{
     return (<div className={"otherUserMessage"}>
        <div className="message-header">
          {/* <div className="message-date">{dateFormat(message.date_sent)}</div> */}
          <div className="message-sender">{otherUserMessages.username}</div>
        </div>
        <div className="message-body-container">
          <div className="message-body-content">{otherUserMessages.message}</div>
        </div>
      </div>)
      }

};

export default SingleMessage;