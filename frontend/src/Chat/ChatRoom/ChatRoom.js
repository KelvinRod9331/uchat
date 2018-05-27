import React, { Component } from "react";
import ReactDOM from "react-dom";
import { form, FormControl } from "react-bootstrap";
import socketIOClient from "socket.io-client";
import axios from "axios";
import SingleMessage from "./SingleMessage";
import UChatAPI from "../../UChatAPI";
import ImagesAPI from '../../Images/ImagesAPI'
import dateFormat from 'dateformat';

var APIKey = require("../config");
var googleTranslate = require("google-translate")(APIKey.keys.googleTranslate);

const socket = socketIOClient("http://localhost:3100");

class ChatRoom extends Component {
  constructor() {
    super();
    this.state = {
      messageValue: "",
      dataOutput: [],
      quote: {},
      randomImg: {}
    };
  }

  getRandomImg = () => {
    var ranNum = Math.floor(Math.random() * Math.floor(14));
    var imgUrl = ImagesAPI.imgArr[ranNum]

    this.setState({
      randomImg: imgUrl
    })
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
    const { thread, currentUser, contactUser, Conversation } = this.props;

    var date = new Date()

    var time = dateFormat(date, "h:MMtt")
    
    if (messageValue) {
      googleTranslate.translate(messageValue, contactUser.language, function(
        err,
        translation
      ) {
        axios
          .post("/messages", {
            thread_id: thread.id,
            sender_id: currentUser.id,
            receiver_id: contactUser.id,
            sender_message: messageValue,
            receiver_message: translation.translatedText,
            date_sent: time,
            isread: false
          })
          .then(() => {
            Conversation(thread.id);
            socket.emit("chat", {
              threadID: thread.id
            });

            socket.emit("notify", {
              action: "incoming-msg",
              username: currentUser.username,
              image: contactUser.profile_pic,
              messages: translation.translatedText,
              language: contactUser.language
            });
          })
          .catch(err => {
          //  this.setState({errMessage: "Could Not Send Message", messageValue: ''}) 
          });
      });
      this.setState({
        messageValue: ""
      });
    }
  };

  retrieveSendersMsg = () => {
    const { Conversation } = this.props;
    socket.on("chat", data => {
      Conversation(data.threadID);
    });
  };

  componentWillMount() {
    this.retrieveSendersMsg();
    this.getRandomImg()
    UChatAPI.randomQuotesGenerator().then(res =>
      this.setState({ quote: res.data })
    );
  }

  render() {
    const { messageValue, dataOutput, quote } = this.state;
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
      return (
        <div className="chatroom-container  placeholder" style={{backgroundImage: `url(${this.state.randomImg})`}} >
          <div id="welcome">
            <h1>WELCOME TO UNIVERSAL CHAT "UniChat" </h1>
            <h3>
              WHERE BRIDGES ARE BUILD NOT BARRIERS, WHERE DIFFERENCE IN LANGUAGE
              SHOULDN'T STOP YOU FROM UNDERSTANDING AND KNOWING THE WORLD
            </h3>
            <p>START A NEW CHAT OR CONTINUE YOUR RECENT CHATS</p>
          </div>
          <div className="quotes-container">
            <h3>{quote.quote}</h3>
            <h3>- {quote.author}</h3>
          </div>
        </div>
      );
    }
  }
}

export default ChatRoom;
