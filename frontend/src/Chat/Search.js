/* eslint-disable */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import socketIOClient from "socket.io-client";
import UChat from "../UChatAPI";
import dateFormat from "dateformat";
const socket = socketIOClient("http://localhost:3100");

export default class Search extends Component {
  constructor() {
    super();
    this.state = {
      results: [],
      inputValue: "",
      message: "",
      requests: []
    };
  }

  determineAction = () => {
    const { search } = this.props;

    switch (search) {
      case "contacts":
        return this.getUsersContacts();

      case "conversation":
        return this.fetchUserThreads();

      case "discovery":
        return this.getUsersContacts();
      default:
    }
  };

  getUsersContacts = () => {
    axios
      .get("/contacts")
      .then(res => {
        this.setState({
          results: res.data.contacts
        });
      })
      .catch(err => console.log("Couldn't Fetch User's Contacts:", err));
  };

  fetchUserThreads = () => {
    axios
      .get("/threads")
      .then(res => {
        this.setState({
          results: res.data.threads
        });
      })
      .catch(err => console.log("Error:", err));
  };

  sendRequest = e => {
    const { currentUser } = this.props;
    const { requests } = this.state;
    let receiverID = e.target.id;

    var date = new Date();
    var time = dateFormat(date, "h:MMtt");
    document.getElementById(receiverID).innerText = "Cancel";

    UChat.postNotifications({
      receiver_id: receiverID,
      sender_id: currentUser.id,
      sender_username: currentUser.username,
      sender_profile_pic: currentUser.profile_pic,
      sender_country: currentUser.country,
      type: "friend-request",
      date_sent: time,
      opened: false
    })
      .then(() => {
       
        socket.emit("notify", {
          action: "friend-request",
          username: currentUser.username
        });
        this.setState({
          requests: [...requests, receiverID]
        });
      })
      .catch(err => console.log("Failed Posting Notification", err));
  };

  cancelRequest = e => {
    const { requests } = this.state;
    const { currentUser } = this.props;
    let receiverID = e.target.id;

    document.getElementById(receiverID).innerText = "Friend Request";

    UChat.deleteNotification({
      receiverID: Number(receiverID),
      senderID: currentUser.id
    })
      .then(() => {
        let modifiedArr = [];

        for (var i = 0; i < requests.length; i++) {
          if (requests[i] !== receiverID) {
            modifiedArr.push(requests[i]);
          }
        }

        console.log("HERE", modifiedArr);
        this.setState({
          requests: modifiedArr
        });
      })
      .catch(err => console.log("Error Deleting Notification", err));
  };

  searchEngine = () => {
    const { inputValue, results, requests } = this.state;
    const {
      search,
      createChatRoom,
      openChatRoom,
      allUsers,
      usersThreads,
      currentUser,
      recentMsg
    } = this.props;

    switch (search) {
      case "contacts":
        return results.map(contact => {
          if (
            contact.username.toLowerCase().includes(inputValue.toLowerCase()) &&
            inputValue
          ) {
            return (
              <div
                className="contacts-container"
                id={contact.contact_id}
                onClick={e =>
                  this.setState({ inputValue: "" }, createChatRoom(e))
                }
              >
                <div
                  className="contact-profile-pic-container"
                  id={contact.contact_id}
                  onClick={e =>
                    this.setState({ inputValue: "" }, createChatRoom(e))
                  }
                >
                  <img
                    className="contact-profile-pic "
                    id={contact.contact_id}
                    src={contact.profile_pic}
                    alt=""
                  />
                </div>
                <div className="contact-info-container" id={contact.contact_id}>
                  <span className="contact-username" id={contact.contact_id}>
                    {" "}
                    {contact.username}
                  </span>{" "}
                  <br />
                  <span id={contact.contact_id}>{contact.about}</span>
                </div>
                <div
                  className={`flag-background flag-${contact.country.toLowerCase()}`}
                />

                <div className="borderBottom" />
              </div>
            );
          }
        });

      case "conversation":
        // eslint-disable-next-line
        return usersThreads.map(thread => {
          let recentObj = recentMsg.find(msg => {
            if (msg.thread_id === thread.id) {
              return msg;
            }
          });

          if (recentObj && recentObj.receiver_message.split(" ").length > 5) {
            let shortMsg =
              recentObj.receiver_message
                .split(" ")
                .slice(0, 2)
                .join(" ") + "...";

            recentObj.receiver_message = shortMsg;
          }

          if (currentUser.id === thread.user_one) {
            if (
              thread.user_two_name
                .toLowerCase()
                .includes(inputValue.toLowerCase()) &&
              inputValue
            ) {
              return (
                <div
                  className="individual-thread"
                  id={thread.id}
                  onClick={e => openChatRoom(e, "search")}
                >
                  <div
                    className="contact-profile-pic-container"
                    id={thread.id}
                    onClick={e => openChatRoom(e, "search")}
                  >
                    <img
                      className="contact-profile-pic "
                      id={thread.id}
                      src={thread.profile_pic}
                      alt=""
                    />
                  </div>
                  <div className="contact-info-container" id={thread.id}>
                    <span className="contact-username" id={thread.id}>
                      {thread.user_two_name}
                    </span>
                    <br />
                    <div id={thread.id} className="recent-msg">
                      {recentObj ? recentObj.receiver_message : ""}
                    </div>

                    <span id={thread.id} className="time-stamp-chats">
                      {recentObj ? recentObj.date_sent : ""}
                    </span>
                  </div>

                  <div className="borderBottom" />
                </div>
              );
            }
          } else if (currentUser.id === thread.user_two) {
            if (
              thread.user_one_name
                .toLowerCase()
                .includes(inputValue.toLowerCase()) &&
              inputValue
            ) {
              return (
                <div
                  className="individual-thread"
                  id={thread.id}
                  onClick={e => openChatRoom(e, "search")}
                >
                  <div
                    className="contact-profile-pic-container"
                    id={thread.id}
                    //onClick={/*This will be used To View Users profile*/}
                  >
                    <img
                      className="contact-profile-pic "
                      id={thread.id}
                      src={thread.profile_pic}
                      alt=""
                    />
                  </div>
                  <div className="contact-info-container" id={thread.id}>
                    <span className="contact-username" id={thread.id}>
                      {thread.user_one_name}
                    </span>
                    <br />
                    <span id={thread.id} className="recent-msg">
                      {recentObj ? recentObj.receiver_message : ""}
                    </span>

                    <span id={thread.id} className="time-stamp-chats">
                      {recentObj ? recentObj.date_sent : ""}
                    </span>
                  </div>
                  <div className="borderBottom" />
                </div>
              );
            }
          }
        });

      case "discovery":
        return allUsers.map(user => {
          if (
            user.username.toLowerCase().includes(inputValue.toLowerCase()) &&
            inputValue
          ) {
            return (
              <div
                className="contacts-container"
                id={user.contact_id}
                // eslint-disable-next-line
                onClick={() =>
                  console.log("This will Be to open their profile ")
                }
              >
                <div
                  className="contact-profile-pic-container"
                  id={user.contact_id}
                  // eslint-disable-next-line
                  onClick={() =>
                    console.log("This will Be to open their profile ")
                  }
                >
                  <img
                    className="contact-profile-pic "
                    id={user.contact_id}
                    src={user.profile_pic}
                    alt=""
                  />
                </div>
                <div className="contact-info-container" id={user.contact_id}>
                  <span className="contact-username" id={user.contact_id}>
                    {" "}
                    {user.username}
                  </span>{" "}
                  <br />
                  <span id={user.contact_id}>
                    {`Language ${user.language}`}
                  </span>
                </div>
                <div
                  className={`flag-background flag-${user.country.toLowerCase()}`}
                />
                <button
                  id={user.id}
                  className="friend-request-btn"
                  onClick={e => {
                    if (requests.includes(e.target.id)) {
                      return this.cancelRequest(e);
                    } else {
                      return this.sendRequest(e);
                    }
                  }}
                >
                  Friend Request
                </button>

                <div className="borderBottom" />
              </div>
            );
          }
        });

      default:
    }
  };

  componentDidMount() {
    this.determineAction();
  }

  render() {
    const { inputValue } = this.state;
    let style = {};
    if (inputValue) {
      style = {
        position: "absolute",
        zIndex: 3,
        marginTop: "14.9%",
        width: "100%",
        height: "74%",
        backgroundColor: "white"
      };
    }

    return (
      <div className="search-placeholder">
        <form className="search-form">
          <span id="search-icon">
            <i class="fas fa-search" />
          </span>
          <span>
            <input
              type="text"
              className="search-inputbox"
              placeholder="Search For Chat Or Person"
              value={inputValue}
              onChange={e => this.setState({ inputValue: e.target.value })}
            />
          </span>
        </form>
        <div className="search-results" style={style}>
          {this.searchEngine()}
        </div>
      </div>
    );
  }
}
