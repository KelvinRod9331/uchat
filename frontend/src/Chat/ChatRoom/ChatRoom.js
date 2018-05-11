import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";
import SingleMessage from './SingleMessage'

const socket = socketIOClient("http://localhost:3100");

class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {},
      messageValue: "",
      dataOutput: [],
      errMessage: "",
      id: ""
    };
  }

  getUser = () => {
    axios.get("/singleUser").then(res => {
      this.setState({
        currentUser: res.data.data[0]
      });
      socket.emit("storeClientInfo", {
        userId: res.data.data[0].id,
        username: res.data.data[0].username,
        language: res.data.data[0].language
      });
    });
  };

  handleInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  // method for emitting a socket.io event
  sendMessages = () => {
    const { messageValue, currentUser } = this.state;
    const { thread } = this.props;

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
    this.getUser();
    this.storeMessages();
  }

  render() {
    const { messageValue, dataOutput, currentUser, id } = this.state;
    const { threadMessages, thread, Conversation } = this.props;
    console.log(thread)
    var size = Object.keys(thread).length;

    var sendingMessages = [],
      receivingMessages = [];
    threadMessages.forEach(messenger => {
      if (currentUser.id === messenger.receiver_id) {
        sendingMessages.push(messenger);
      } else if (currentUser.id === messenger.sender_id) {
        receivingMessages.push(messenger);
      }
    });

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
              <p>Online</p>
            </span>

            <div className="video-call-setting-container">
              <i class="fas fa-phone" />
              <i class="fas fa-video" />
              <i class="fas fa-ellipsis-v" />
            </div>
          </div>
          <div className="message-container">
            <SingleMessage currentUser={currentUser}  message={threadMessages} contact={thread} receivingMessages={receivingMessages}  sendingMessages={sendingMessages}/>
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

/**
 {away.map((e, i) => {
                return (
                  <div key={i} className="receiver-individual-messages">
                    <div>
                    <img
                        // src={thread.profile_pic}
                        src={`https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/30821925_204356536843208_2842258653858203098_o.jpg?_nc_cat=0&oh=54b74a965018171b01d5101e362b5c85&oe=5B8A54A1`}
                        className="inchat-profile-img"
                        />
                      
                    </div>  

                        <div>
                      {e.sender_message}
                    </div>
                  </div>
                );
              })}

              {home.map((e, i) => {
                return (
                  <div key={i} className="sender-individual-messages">
                    <p>{e.receiver_message}</p>
                  </div>
                );
              })}
receivingMessages={receivingMessages}  sendingMessages={sendingMessages}
 */
