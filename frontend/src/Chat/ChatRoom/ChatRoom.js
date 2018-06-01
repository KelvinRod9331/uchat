/* eslint-disable */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { form, FormControl } from "react-bootstrap";
import {
  Modal,
  Popover,
  Button,
  Input,
  Icon,
  Badge,
  Card,
  Tooltip
} from "antd";
import socketIOClient from "socket.io-client";
import axios from "axios";
import SingleMessage from "./SingleMessage";
import UChat from "../../UChatAPI";
import ImagesAPI from "../../Images/ImagesAPI";
import dateFormat from "dateformat";
import { animateScroll } from "react-scroll";

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
      randomImg: {},
      smileys_people: {},
      animals_nature: {},
      food_drinks: {},
      activity: {},
      travel_places: {},
      objects: {},
      symbols: {},
      flags: {},
      emojiValue: "",
      showEmoji: false
    };
  }

  getRandomImg = () => {
    var ranNum = Math.floor(Math.random() * Math.floor(14));
    var imgUrl = ImagesAPI.imgArr[ranNum];

    this.setState({
      randomImg: imgUrl
    });
  };

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

    var date = new Date();

    var time = dateFormat(date, "h:MMtt");

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
              receiver_id: contactUser.id,
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
      this.scrollToBottom();
    });
  };

  scrollToBottom() {
    animateScroll.scrollToBottom({
      containerId: "message-container"
    });
  }

  handleEmojiInput = e => {
    this.setState({
      emojiValue: e.target.value
    });
  };

  handleEmojiOutput = e => {
    const { messageValue } = this.state;
    let emoji = e.target.id;
    this.setState({
      messageValue: messageValue + emoji
    });
  };

  sortEmojis = () => {
    let emoji = UChat.emojiApi;
    let smileyData = [];
    let flagsData = [];
    let travelData = [];
    let objectsData = [];
    let foodData = [];
    let animalsData = [];
    let activityData = [];
    let symbolsData = [];

    for (var key in emoji) {
      if (key === "smileys_people") {
        let obj = {};
        obj = emoji[key];
        for (var key in obj) {
          smileyData.push([key, obj[key]]);
        }
      } else if (key === "animals_nature") {
        let obj = {};
        obj = emoji[key];
        for (var key in obj) {
          animalsData.push([key, obj[key]]);
        }
      } else if (key === "food_drinks") {
        let obj = {};
        obj = emoji[key];
        for (var key in obj) {
          foodData.push([key, obj[key]]);
        }
      } else if (key === "activity") {
        let obj = {};
        obj = emoji[key];
        for (var key in obj) {
          activityData.push([key, obj[key]]);
        }
        
      } else if (key === "travel_places") {
        let obj = {};
        obj = emoji[key];
        for (var key in obj) {
          travelData.push([key, obj[key]]);
        }
      } else if (key === "objects") {
        let obj = {};
        obj = emoji[key];
        for (var key in obj) {
          objectsData.push([key, obj[key]]);
        }
      } else if (key === "symbols") {
        let obj = {};
        obj = emoji[key];
        for (var key in obj) {
          symbolsData.push([key, obj[key]]);
        }
      } else if (key === "flags") {
        let obj = {};
        obj = emoji[key];
        for (var key in obj) {
          flagsData.push([key, obj[key]]);
        }
      }
    }

    console.log(symbolsData);

    this.setState({
      smileys_people: smileyData,
      animals_nature: animalsData,
      food_drinks: foodData,
      activity: activityData,
      travel_places: travelData,
      objects: objectsData,
      symbols: symbolsData,
      flags: flagsData
    });
  };

  emojiDisplay = () => {
    const {
      smileys_people,
      animals_nature,
      food_drinks,
      activity,
      travel_places,
      objects,
      symbols,
      flags,
      emojiValue
    } = this.state;

    return (
      <div>
        <div className="emoji-search">
          <Input
            placeholder="Search Emoji"
            id="emoji-input"
            value={emojiValue}
            onChange={this.handleEmojiInput}
          />
        </div>
        <div className="emoji-content">
          <div className="smiley_people">
            <div className="title">
              <h3>Smiley's {"&"} People</h3>
            </div>
            {smileys_people.map((el, idx) => {
              if (el[0].includes(emojiValue)) {
                return (
                  <span className='emoji-icon' key={idx} id={el[1]} onClick={this.handleEmojiOutput}>
                    {el[1]}
                  </span>
                );
              }
            })}
          </div>
          <div className="smiley_people">
            <div className="title">
              <h3>Animals {"&"} Nature</h3>
            </div>
            {animals_nature.map((el, idx) => {
              if (el[0].includes(emojiValue)) {
                return (
                  <span className='emoji-icon' key={idx} id={el[1]} onClick={this.handleEmojiOutput}>
                    {el[1]} 
                  </span>
                );
              }
            })}
          </div>
          <div className="smiley_people">
            <div className="title">
              <h3>Food {"&"} Drinks</h3>
            </div>
            {food_drinks.map((el, idx) => {
              if (el[0].includes(emojiValue)) {
                return (
                  <span className='emoji-icon' key={idx} id={el[1]} onClick={this.handleEmojiOutput}>
                    {el[1]}
                  </span>
                );
              }
            })}
          </div>
          <div className="smiley_people">
            <div className="title">
              <h3>Activity</h3>
            </div>
            {activity.map((el, idx) => {
              if (el[0].includes(emojiValue)) {
                return (
                  <span className='emoji-icon' key={idx} id={el[1]} onClick={this.handleEmojiOutput}>
                    {el[1]}
                  </span>
                );
              }
            })}
          </div>
          <div className="smiley_people">
            <div className="title">
              <h3>Travel {"&"} Places</h3>
            </div>
            {travel_places.map((el, idx) => {
              if (el[0].includes(emojiValue)) {
                return (
                  <span className='emoji-icon' key={idx} id={el[1]} onClick={this.handleEmojiOutput}>
                    {el[1]}
                  </span>
                );
              }
            })}
          </div>
          <div className="smiley_people">
            <div className="title">
              <h3>Objects</h3>
            </div>
            {objects.map((el, idx) => {
              if (el[0].includes(emojiValue)) {
                return (
                  <span className='emoji-icon' key={idx} id={el[1]} onClick={this.handleEmojiOutput}>
                    {el[1]}
                  </span>
                );
              }
            })}
          </div>
          <div className="smiley_people">
            <div className="title">
              <h3>Symbols</h3>
            </div>
            {symbols.map((el, idx) => {
              if (el[0].includes(emojiValue)) {
                return (
                  <span className='emoji-icon' key={idx} id={el[1]} onClick={this.handleEmojiOutput}>
                    {el[1]}
                  </span>
                );
              }
            })}
          </div>
          <div className="smiley_people">
            <div className="title">
              <h3>Flags</h3>
            </div>
            {flags.map((el, idx) => {
              if (el[0].includes(emojiValue)) {
                return (
                  <span className='emoji-icon' key={idx} id={el[1]} onClick={this.handleEmojiOutput}>
                    {el[1]}
                  </span>
                );
              }
            })}
          </div>
        </div>
      </div>
    );
  };

  componentWillMount() {
    this.retrieveSendersMsg();
    this.getRandomImg();
    UChat.randomQuotesGenerator().then(res =>
      this.setState({ quote: res.data })
    );
    this.sortEmojis();
  }

  render() {
    const { messageValue, dataOutput, quote, smileys_people } = this.state;
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
          <div className="message-container" id="message-container">
            <SingleMessage
              currentUser={currentUser}
              threadMessages={threadMessages}
              contact={contactUser}
            />
          </div>
          <div className="message-form">
            <Popover
              content={this.emojiDisplay()}
              overlayStyle={{
                width: "60%",
                maxHeight: "400px",
                overflow: "scroll",
                minHeight: "100px",
                padding: "-100px 0 0 10%"
              }}
              trigger="click"
              placement="topRight"
            >
              <div className="emoji-container" />
            </Popover>
            <form onSubmit={this.sendMessages}>
              <FormControl
                type="text"
                className="input-message"
                value={messageValue}
                name={"messageValue"}
                onChange={this.handleInput}
                placeholder=" Type your message here..."
              />
              <img src="/images/microphone-icon.png" className="microphone" />
            </form>
          </div>
        </div>
      );
    } else {
      return (
        <div
          className="chatroom-container  placeholder"
          style={{ backgroundImage: `url(${this.state.randomImg})` }}
        >
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
