import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";
import SingleMessage from './SingleMessage'

const socket = socketIOClient("http://localhost:3100");

class ChatRoom extends Component {
  constructor() {
    super();
    this.state = {
      messageValue: "",
      dataOutput: [],
      errMessage: "",
      id: ""
    };
  }


  handleInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  // method for emitting a socket.io event
  sendMessages = () => {
    const { messageValue } = this.state;
    const { thread, currentUser } = this.props;

    socket.emit("chat", {
      messages: messageValue,
      username: currentUser.username,
      user_id: currentUser.id,
      threadID: thread.id,
      sender_id:
        currentUser.id === thread.user_two ? thread.user_two : thread.user_one,
      receiver_id:
        currentUser.id === thread.user_one ? thread.user_two : thread.user_one,
      language: currentUser.language
    });

    this.setState({
      messageValue: ""
    });
  };

  storeMessages = () => {
    const { Conversation } = this.props;

    socket.on("chat", data => {
      console.log('This is fired?', data)
      axios
        .post("/messages", {
          thread_id: data.threadID,
          sender_id: data.sender_id,
          receiver_id: data.receiver_id,
          sender_message: data.originalMessage,
          receiver_message: data.translatedMessage,
          date_sent: "no time",
          isread: "false"
        })
        .then(() => {
          Conversation(data.threadID);
        })
        .catch(err => {
          errMessage: "Could Not Send Message";
        });
    });
  };

  componentDidMount() {
    this.storeMessages()
  }

  render() {
    const { messageValue, dataOutput, id } = this.state;
    const { threadMessages, thread, Conversation, currentUser} = this.props;
  
    var size = Object.keys(thread).length;
    

    if (size) {
      return (
        <div className="chatroom-container">
          <div className="username-container">
            <span id="username-header">
              <p>
                {currentUser.username === thread.username
                  ? currentUser.username
                  : thread.username}
              </p>
            </span>

            <span id="username-header">
             {thread.username ? <p>Online</p> : <p>Offline</p> } 
            </span>

            <div className="video-call-setting-container">
              <i class="fas fa-phone" />
              <i class="fas fa-video" />
              <i class="fas fa-ellipsis-v" />
            </div>
          </div>
          <div className="message-container">
            <SingleMessage currentUser={currentUser}  threadMessages={threadMessages} contact={thread} />
          </div>
          <div className="message-form">
            <input
              type="text"
              className="input-message"
              value={messageValue}
              name={"messageValue"}
              onChange={this.handleInput}
              placeholder="Type your message here..."
            />
            <button onClick={this.sendMessages} className="send-btn">
              <i class="fas fa-arrow-circle-right" />
            </button>
          </div>
        </div>
      );
    } else {
      return <div className="chatroom-container">Placeholder For Now</div>;
    }
  }
}

export default ChatRoom;

