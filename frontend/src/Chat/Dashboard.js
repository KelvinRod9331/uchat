import React, { Component } from "react";
import { Grid, Row, Col, } from "react-bootstrap";
import { Redirect } from "react-router";
import socketIOClient from "socket.io-client";
import axios from "axios";
import "./index.css";
import "../../node_modules/flag-icon-css/css/flag-icon.css";
import "./FlagsBackground.css";
import "react-notifications/lib/notifications.css";
import ChatRoom from "./ChatRoom/ChatRoom";
import Contacts from "./Contacts";
import Chats from "./Chats";
import Search from "./Search";
import Notifications from "./Notifications";
import ModalPages from "./ModalPages"

const socket = socketIOClient("http://localhost:3100");

var loggedIn = false;

export default class DashboardUpdate extends Component {
  constructor() {
    super();
    this.trigger = false
    this.state = {
      selected: "chats",
      currentUser: {},
      threads: [],
      recentMsg: [],
      allUsers: []
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
          threads: res.data.threads
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

  displayWindow = () => {
    const { selected, currentUser, threads, recentMsg, allUsers } = this.state;

    switch (selected) {
      case "notifications":
      this.trigger = true
      case "chats":
        return (
          <Chats
            usersThreads={threads}
            currentUser={currentUser}
            recentMsg={recentMsg}
            search={"conversation"}
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
      case "feed":
        return;
      case "add-friend":
        return (
          <div className="add-friend-container">
            <Search
              allUsers={allUsers}
              currentUser={currentUser}
              search={"users"}
            />
          </div>
        );

      default:
        return (
          <Chats
            usersThreads={threads}
            currentUser={currentUser}
            recentMsg={recentMsg}
            search={"conversation"}
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
    const { handleSelection, displayWindow, userLoggedIn } = this;

    if (loggedIn) {
      return (
        <Grid bsClass="dashboard-container">
          <Notifications />
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
                id="notifications"
                onClick={handleSelection}
              >
                <img
                  id="notifications"
                  src="/images/notifications-icon.png"
                  width="60px"
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
                <img id="settings" src="/images/settings.png" width="50px" />
              </div>
            </Col>
          </Row>

          <Row>
            <div className="display-box">{displayWindow()}</div>
          </Row>
        </Grid>
      );
    } else {
      return <Redirect to="/" />;
    }
  }
}
