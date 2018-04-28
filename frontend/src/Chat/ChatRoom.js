import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";
const socket = socketIOClient("http://localhost:3100");

class ChatRoom extends Component {
  constructor() {
    super();
    this.state = {
      userInfo: {},
      messageValue: "",
      handleValue: "",
      dataOutput: []
    };
  }

  getUser = () => {
    axios.get("/singleUser").then(res => {
      console.log(res.data.data);
      this.setState({
        userInfo: res.data.data[0]
      });
      socket.emit("storeClientInfo", {
        customId: res.data.data[0].id
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
    socket.emit("chat", {
      messages: messageValue,
      user: userInfo.username
    });

    this.setState({
      messageValue: ""
    });
  };

  componentDidMount() {
    this.getUser();
  }

  render() {
    const { messageValue, dataOutput, userInfo } = this.state;

    socket.on("chat", data => {
      this.setState({
        dataOutput: [...dataOutput, data]
      });
    });
    return (
      <div
        className="chatroom-container"
        style={{
          width: "50%",
          height: "580px",
          border: " 2px solid blue",
          marginLeft: "25%"
        }}
      >
        <div>
          <div className="username-header">
            {" "}
            <h2>{userInfo.username}</h2>
          </div>
          <div
            className="message-container"
            style={{
              width: "100%",
              height: "400px",
              border: " 2px solid blue",
              marginTop: "10%"
            }}
          >
            {dataOutput.map(e => {
              return (
                <div>
                  <p>
                    {e.user}: {e.messages}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <input
          type="text"
          className="input-message"
          value={userInfo.username}
          name={"handleValue"}
          placeholder="Handle"
          onChange={this.handleInput}
        />

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
    );
  }
}

export default ChatRoom;
