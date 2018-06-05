/* eslint-disable */
import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
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
import Notify from "./Notify";
import ModalPages from "./ModalPages";
import Menu from "./Menu";
import Notifications from './Notifications'
import Discovery from './Discovery'

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
    this.setState({ selected: e.target.id });
  };

  openChatRoom = (e, source) => {
    const { usersThreads } = this.state;

    if (source === "chats") {
      let thread = usersThreads.find(
        thread => thread.id === Number(e.target.id)
      );
      this.setState({ threadSelected: thread }, () => this.getUserByID(thread));
    } else if (source === "contacts") {
      let thread = e;
      this.setState({ threadSelected: thread }, () => this.getUserByID(thread));
    } else if (source === "search") {
      let thread = usersThreads.find(
        thread => thread.id === Number(e.target.id)
      );
      this.setState({ threadSelected: thread }, () => this.getUserByID(thread));
    }
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
      threadSelected,
      threadMessages,
      contactUser
    } = this.state;

    switch (selected) {
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
            fetchRecentMessage={this.fetchRecentMessage}
            fetchUserThreads={this.fetchUserThreads}
          />
        );
      case "contacts":
        return (
          <Contacts
            currentUser={currentUser}
            allUsers={allUsers}
            search={"contacts"}
            usersThreads={usersThreads}
            openChatRoom={this.openChatRoom}
            fetchUserThreads={this.fetchUserThreads}
          />
        );

      case "discovery":
        return (
          <Discovery
            currentUser={currentUser}
            search={"discovery"}
            allUsers={allUsers}
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
          fetchRecentMessage={this.fetchRecentMessage}
          fetchUserThreads={this.fetchUserThreads}
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
    const {
      handleSelection,
      displayWindow,
      userLoggedIn,
      fetchConversation
    } = this;
    const {
      threadMessages,
      threadSelected,
      contactUser,
      currentUser
    } = this.state;

    if (loggedIn) {
      return (
        <Grid bsClass="dashboard-container">
          <Notify />
          <Col className="left-display">
            <Row className="user-header-row">
              <div className="user-profile-img-container">
                <img
                  src={currentUser.profile_pic}
                  className="user-profile-img"
                />
              </div>
              <div className="contact-info-container">
                <span className="contact-username">
                  {" "}
                  {currentUser.username}
                </span>{" "}
                <br />
                <span>{currentUser.about}</span>
              </div>
              <div className="component-box" >
                <div id='add-friend'>
                  <Notifications currentUser={currentUser}/>
                </div>
                <div id="menu">
                  <Menu
                    currentUser={currentUser}
                    userLoggedIn={this.userLoggedIn}
                  />
                </div>
              </div>
            </Row>
            <Row className="component-row">
              <div className="components-container">
                <Col
                  className="inner-component-box"
                  id="chats"
                  onClick={handleSelection}
                >
                  <img id="chats" src="/images/speech-bubble-square.png" />
                  <p id="chats">Messages</p>
                </Col>
                <Col
                  className="inner-component-box"
                  id="contacts"
                  onClick={handleSelection}
                >
                  <img id="contacts" src="/images/contacts-icon.png" />
                  <p id="contacts">Contacts</p>
                </Col>
                <Col
                  className="inner-component-box"
                  id="discovery"
                  onClick={handleSelection}
                >
                  <img id="discovery" src="/images/world-discovery.png" />
                  <p id="discovery">Discovery</p>
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
