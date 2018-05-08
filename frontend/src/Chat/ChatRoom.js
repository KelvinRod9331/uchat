import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";
const socket = socketIOClient("http://localhost:3100");

class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      messageValue: "",
      dataOutput: [],
      errMessage: "",
      id: ""
    };
  }

  getUser = () => {
    axios.get("/singleUser").then(res => {
      this.setState({
        userInfo: res.data.data[0]
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
    const { messageValue, userInfo } = this.state;
    const { thread } = this.props;

    socket.emit("chat", {
      messages: messageValue,
      username: userInfo.username,
      user_id: userInfo.id,
      threadID: thread.id,
      sender_id:
        userInfo.id === thread.user_two ? thread.user_two : thread.user_one,
      receiver_id:
        userInfo.id === thread.user_one ? thread.user_two : thread.user_one,
      language: userInfo.language
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
    const { messageValue, dataOutput, userInfo, id } = this.state;
    const { threadMessages, thread, Conversation } = this.props;

    var size = Object.keys(thread).length;
  
    var home = [],
      away = [];
    threadMessages.forEach(thread => {
      if (userInfo.id === thread.receiver_id ) {
        home.push(thread);
      } else if (userInfo.id === thread.sender_id) {
        away.push(thread);
      }
    });

    if (size) {
      return (
        <div className="chatroom-container">
          <div>
            <div className="username-header">
              {" "}
              <h4>
                {userInfo.username === thread.username
                  ? userInfo.username
                  : thread.username}
              </h4>
            </div>
            <div className="message-container">
              <div
                style={{
                  float: "right",
                  border: "1px solid black",
                  width: "200px",
                }}
              >
                {away.map((e, i) => {
                  return (
                    <div key={i}>
                      <p>{e.sender_message}</p>
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  float: "left",
                  border: "1px solid black",
                  width: "200px",
                }}
              >
                {home.map((e, i) => {
                  return (
                    <div key={i}>
                      <p>{e.receiver_message}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="message-form">
            <input
              type="text"
              className="input-message"
              value={messageValue}
              name={"messageValue"}
              onChange={this.handleInput}
              placeholder="Send Message"
            />
            <button onClick={this.sendMessages}>Send</button>
          </div>
        </div>
      );
    } else {
      return <div className="chatroom-container">Placeholder For Now</div>;
    }
  }
}

export default ChatRoom;
