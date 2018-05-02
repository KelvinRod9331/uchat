import React, { Component } from "react";
import { Grid, Row } from "react-bootstrap";
import { Redirect } from "react-router";
import axios from "axios";
import "./index.css";
import ChatRoom from "./ChatRoom";
import Contacts from "./Contacts";

var loggedIn = false;

class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      selected: "chats",
      userInfo: [],
      threads: []
    };
  }

  userLoggedIn = () => {
    axios
      .get("/singleUser")
      .then(res => {
        this.setState({
          userInfo: res.data.data[0]
        });
        loggedIn = true;
      })
      .catch(err => {
        loggedIn = false;
      });
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

  handleSelection = e => {
    this.setState({ selected: e.target.id });
  };

  displayWindow = () => {
    const { selected, userInfo, threads } = this.state;
    switch (selected) {
      case "chats":
        return <ChatRoom threads={threads} />;
      case "contacts":
        return <Contacts userInfo={userInfo} />;
      default:
        return "";
    }
  };

  componentDidMount() {
    this.userLoggedIn();
    this.fetchUserThreads();
  }

  render() {
    const { handleSelection, displayWindow, userLoggedIn } = this;
    if (loggedIn) {
      return (
        <Grid bsClass="dashboard-container">
          <Row bsClass="component-container">
            <div className="component-box" id="chats" onClick={handleSelection}>
              <p id="chats">Chats</p>
            </div>
            <div
              className="component-box"
              id="contacts"
              onClick={handleSelection}
            >
              <p id="contacts">Contacts</p>
            </div>
            <div
              className="component-box"
              id="status"
              onClick={handleSelection}
            >
              <p id="status">Status </p>
            </div>
          </Row>
          <Row bsClass="display-container">
            <div className="display-box">{displayWindow()}</div>
          </Row>
        </Grid>
      );
    } else {
      return <Redirect to="/" />;
    }
  }
}

export default Dashboard;
