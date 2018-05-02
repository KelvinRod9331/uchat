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
      dataOutput: [],
      errMessage: ''
    };
  }

  getUser = () => {
    axios.get("/singleUser").then(res => {
      console.log(res.data.data);
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
    const {threads} = this.props
    
    axios
    .post("/messages",{
      thread_id: threads[0].id,
      sender_id: userInfo.id,
      receiver_id: userInfo.id === threads[0].user_two? threads[0].user_one : threads[0].user_two,
      sender_body: threads[0].user_one === userInfo.id ? messageValue : '',
      receiver_body: threads[0].user_two === userInfo.id ? messageValue : '',
      date_sent: 'no time',
      isread: 'false'
    })
    .then(res => {
      socket.emit("chat", {
        messages: messageValue,
        username: userInfo.username,
        user_id: userInfo.id,
        sender_id: threads[0].user_one,
        receiver_id: threads[0].user_two,
        language: userInfo.language
      });
      this.setState({
        messageValue: ""
      });
    })
    .catch(err => {
      errMessage: "Could Not Send Message"
    })
  };


  fetchConversation = () => {
    const {threads} = this.props
    
    const { dataOutput} = this.state;
    axios
    .get(`/messages/1`)
    .then(res => {
      console.log('res', res.data.messages)
      this.setState({
        dataOutput: res.data.messages
      });
    })
    .catch(err => console.log('err', err))
  }

  componentDidMount() {
    this.getUser();
    // this.fetchConversation()
  }


  render() {
    const { messageValue, dataOutput, userInfo } = this.state;

    socket.on("chat", data => {
      console.log("ChatRomm Data:", data)
      this.setState({
        dataOutput: [...dataOutput, data]
      });
    });

    console.log("ChatRoom Data Output", dataOutput)
    
 
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
                      {e.username}: {e.messages}
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
