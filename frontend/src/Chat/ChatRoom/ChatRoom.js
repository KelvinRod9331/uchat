import React, { Component } from "react";
import { form, FormControl } from "react-bootstrap";
import socketIOClient from "socket.io-client";
import axios from "axios";
import SingleMessage from "./SingleMessage";

const socket = socketIOClient("http://localhost:3100");

class ChatRoom extends Component {
  constructor() {
    super();
    this.state = {
      messageValue: "",
      dataOutput: []
    };
  }

  handleInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  // method for emitting a socket.io event
  sendMessages = e => {
    e.preventDefault();
    const { messageValue } = this.state;

    const { thread, currentUser, contactUser } = this.props;

    console.log({ contactUser: contactUser });

    if (messageValue) {
      socket.emit("chat", {
        messages: messageValue,
        username: contactUser.username,
        user_id: currentUser.id,
        threadID: thread.id,
        sender_id: currentUser.id,
        receiver_id: contactUser.id,
        language: contactUser.language
      });

      socket.emit("notify", {
        action: "incoming-msg",
        username: currentUser.username,
        image: contactUser.profile_pic,
        messages: messageValue,
        language: contactUser.language,
      });
    }

    this.setState({
      messageValue: ""
    });
  };

  storeMessages = () => {
    const { Conversation } = this.props;

    socket.on("chat", data => {
      console.log("This is fired?", data);
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

  componentWillMount() {
    this.storeMessages();
  }

  render() {
    const { messageValue, dataOutput, id } = this.state;
    const {
      threadMessages,
      thread,
      Conversation,
      currentUser,
      contactUser
    } = this.props;

    var size = Object.keys(thread).length;

    if (size) {
      return (
        <div className="chatroom-container">
          <div className="username-container">
            <div className="contact-profile-pic-container">
              <img
                className="contact-profile-pic "
                src={contactUser.profile_pic}
              />
            </div>
            <div className="contact-info-header">
              <span id="username-header">
                <p>{contactUser.username}</p>
              </span>

              <span id="username-status">
                {contactUser.username ? <p>Online</p> : <p>Offline</p>}
              </span>
            </div>
            <div className="video-call-setting-container">
              <i class="fas fa-phone" />
              <i class="fas fa-video" />
              <i class="fas fa-ellipsis-v" />
            </div>
          </div>
          <div className="message-container">
            <SingleMessage
              currentUser={currentUser}
              threadMessages={threadMessages}
              contact={contactUser}
            />
          </div>
          <div className="message-form">
            <form onSubmit={this.sendMessages}>
              <FormControl
                type="text"
                className="input-message"
                value={messageValue}
                name={"messageValue"}
                onChange={this.handleInput}
                placeholder="Type your message here..."
              />
              <img src="/images/microphone-icon.png" className="microphone" />
            </form>
          </div>
        </div>
      );
    } else {
      return <div className="chatroom-container">Placeholder For Now</div>;
    }
  }
}

export default ChatRoom;
