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
      user: userInfo.username,
      language: userInfo.language
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
      <div className="chatroom-container">
        <div>
          <div className="username-header">
            {" "}
            <h4>{userInfo.username}</h4>
          </div>
          <div className="message-container">
            {dataOutput.map((e, i )=> {
              return (
                <div
                style ={
                {
                  float: i % 2 === 0 ? 'left' : 'right',
                  border: '1px solid black',
                  position: 'static',
                  top: '0'
                }

                }
                >
                  <p>
                    {e.user}: {e.messages}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <div className='message-form'>
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
  }
}

export default ChatRoom;
