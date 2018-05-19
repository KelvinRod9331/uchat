import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import Modal from "react-responsive-modal";
import { Redirect } from "react-router";
import socketIOClient from "socket.io-client";
import axios from "axios";
import "./Dashboard.css";
import "../../node_modules/flag-icon-css/css/flag-icon.css";
import "./FlagsBackground.css";
import "react-notifications/lib/notifications.css";
import ChatRoom from "./ChatRoom/ChatRoom";
import Contacts from "./Contacts";
import Chats from "./Chats";
import Search from "./Search";
import Notifications from "./Notifications";
import ModalPages from "./ModalPages";

const socket = socketIOClient("http://localhost:3100");

var loggedIn = false;

export default class DashboardUpdate extends Component {
  constructor() {
    super();
    this.state = {
      selected: "chats",
      currentUser: {},
      usersThreads: [],
      recentMsg: [],
      allUsers: [],
      open: false,
      threadSelected: {},
      threadMessages: [],
      contactUser: {}
    };
  }

  userLoggedIn = () => {
    axios
      .get("/singleUser")
      .then(res => {
        this.setState({
          currentUser: res.data.data[0]
        });
        socket.emit("storeClientInfo", {
          userId: res.data.data[0].id,
          username: res.data.data[0].username,
          language: res.data.data[0].language
        });
        loggedIn = true;
      })
      .catch(err => {
        loggedIn = false;
      });
  };

  fetchUsers = () => {
    axios
      .get("/allUsers")
      .then(res => {
        this.setState({
          allUsers: res.data.allUsers
        });
      })
      .catch(err => console.log("Error", err));
  };

  fetchUserThreads = () => {
    axios
      .get("/threads")
      .then(res => {
        this.setState({
          usersThreads: res.data.threads
        });
      })
      .catch(err => console.log("Error:", err));
  };

  fetchRecentMessage = () => {
    axios
      .get("/recentMsg")
      .then(res => {
        this.setState({
          recentMsg: res.data.recentMsg
        });
      })
      .catch(err => console.log("Error Getting Recent Message", err));
  };

  handleSelection = e => {
    this.setState({ selected: e.target.id, open: true });
  };

  openChatRoom = e => {
    const { usersThreads } = this.state;
    let threadSelected = usersThreads.find(thread => {
      if (thread.id === Number(e.target.id)) {
        return thread;
      }
    });

    this.setState({threadSelected: threadSelected},
      () => this.getUserByID(threadSelected)
    );
  };

  getUserByID = thread => {
    const { currentUser } = this.state;

    if (thread.user_one === currentUser.id) {
      axios
        .get(`/userByID/${thread.user_two}`)
        .then(res => {
          this.setState(
            {
              contactUser: res.data.user[0]
            },
            () => this.fetchConversation(thread.id)
          );
        })
        .catch(err => console.log(err));
    } else {
      axios
        .get(`/userByID/${thread.user_one}`)
        .then(res => {
          this.setState(
            {
              contactUser: res.data.user[0]
            },
            () => this.fetchConversation(thread.id)
          );
        })
        .catch(err => console.log(err));
    }
  };

  fetchConversation = id => {
    axios
      .get(`/messages/${id}`)
      .then(res => {
        this.setState({
          threadMessages: res.data.messages
        });
      })
      .catch(err => console.log("err", err));
  };

  displayWindow = () => {
    const {
      selected,
      currentUser,
      usersThreads,
      recentMsg,
      allUsers,
      open,
      threadSelected,
      threadMessages,
      contactUser
    } = this.state;

    switch (selected) {
      case "notifications":
        return <ModalPages trigger={true} />;
      case "chats":
        return (
          <Chats
           usersThreads={usersThreads}
            currentUser={currentUser}
            recentMsg={recentMsg}
            search={"conversation"}
            threadMessages={threadMessages}
            threadSelected={threadSelected}
            contactUser={contactUser}
            openChatRoom={this.openChatRoom}
          />
        );
      case "contacts":
        return (
          <Contacts
            currentUser={currentUser}
            allUsers={allUsers}
            search={"contacts"}
          />
        );

      default:
        return (
          <Chats
          usersThreads={usersThreads}
          currentUser={currentUser}
          recentMsg={recentMsg}
          search={"conversation"}
          threadMessages={threadMessages}
          threadSelected={threadSelected}
          contactUser={contactUser}
          openChatRoom={this.openChatRoom}
          />
        );
    }
  };

  componentWillMount() {
    this.userLoggedIn();
    this.fetchUsers();
    this.fetchRecentMessage();
    this.fetchUserThreads();
    this.displayWindow();
  }

  render() {
    const { handleSelection, displayWindow, userLoggedIn, fetchConversation } = this;
    const { threadMessages, threadSelected, contactUser, currentUser } = this.state;

    if (loggedIn) {
      return (
        <Grid bsClass="dashboard-container">
          <Col className="left-display">
            <Row className="user-header-row">
              <div className="user-profile-img-container">
                <img
                  src={`https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/30821925_204356536843208_2842258653858203098_o.jpg?_nc_cat=0&oh=54b74a965018171b01d5101e362b5c85&oe=5B8A54A1`}
                  className="user-profile-img"
                />
              </div>
              <div className="contact-info-container">
                <span> {currentUser.username}</span>{" "}
              </div>
              <div className="component-box" onClick={handleSelection}>
                <div className="notification-indicator" />
                <img
                  id="add-friend"
                  src="/images/request-notification-icon.png"
                />
                <i
                  id="settings"
                  onClick={handleSelection}
                  class="fas fa-ellipsis-v"
                />
              </div>
            </Row>
            <Row className="component-row">
              <div className="components-container">
                <Col
                  className="inner-component-box"
                  id="chats"
                  onClick={handleSelection}
                >
                  <img
                    id="chats"
                    src="/images/speech-bubble-square.png"
                    width="50px"
                  />
                </Col>
                <Col
                  className="inner-component-box"
                  id="contacts"
                  onClick={handleSelection}
                >
                  <img
                    id="contacts"
                    src="/images/contacts-icon.png"
                    width="50px"
                  />
                </Col>
                <Col
                  className="inner-component-box"
                  id="feed"
                  onClick={handleSelection}
                >
                  <img id="feed" src="/images/world-feed.png" width="50px" />
                </Col>
              </div>
            </Row>
            <Row>
              <div className="display-box">{displayWindow()}</div>
            </Row>
          </Col>

          <Col className="right-display">
            <ChatRoom
              thread={threadSelected}
              threadMessages={threadMessages}
              Conversation={fetchConversation}
              currentUser={currentUser}
              contactUser={contactUser}
            />
          </Col>
        </Grid>
      );
    } else {
      return <Redirect to="/" />;
    }
  }
}

/*


<Notifications />
        <Modal
          open={this.state.open}
          onClose={() => this.setState({ open: false })}
          center
        >
          <div className="add-friend-container">
            <Search
              allUsers={this.state.allUsers}
              currentUser={this.state.currentUser}
              search={"users"}
            />
          </div>
        </Modal>
        <Row bsClass="leftside-navbar">
          <Col>
            <div className="user-profile-img-container">
              <img
                src={`https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/30821925_204356536843208_2842258653858203098_o.jpg?_nc_cat=0&oh=54b74a965018171b01d5101e362b5c85&oe=5B8A54A1`}
                className="user-profile-img"
              />
            </div>
          </Col>

          <Col>
            <div
              className="component-box"
              id="chats"
              onClick={handleSelection}
            >
              <img
                id="chats"
                src="/images/speech-bubble-square.png"
                width="50px"
              />
            </div>
          </Col>
          <Col>
            <div
              className="component-box"
              id="contacts"
              onClick={handleSelection}
            >
              <img
                id="contacts"
                src="/images/contacts-icon.png"
                width="50px"
              />
            </div>
          </Col>
        

          <Col>
            <div
              className="component-box"
              id="feed"
              onClick={handleSelection}
            >
              <img id="feed" src="/images/world-feed.png" width="50px" />
            </div>
          </Col>
             
             <Col>
             <div
               className="component-box"
               id="add-friend"
               onClick={handleSelection}
             >
               <img
                 id="add-friend"
                 src="/images/add-contacts.png"
                 width="48px"
               />
             </div>
           </Col>
           <Col>
             <div
               className="component-box"
               id="settings"
               onClick={handleSelection}
             >
               <i  id="settings"
               onClick={handleSelection}
               class="fal fa-ellipsis-v">
               </i>
             </div>
           </Col>
         </Row>
 
         <Row>
           <div className="display-box">{displayWindow()}</div>
         </Row>

*/
