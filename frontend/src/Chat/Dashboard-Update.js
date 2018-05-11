import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Redirect } from "react-router";
import socketIOClient from "socket.io-client";
import axios from "axios";
import "./index.css";
import ChatRoom from "./ChatRoom";
import Contacts from "./Contacts";
import Chats from "./Chats";
const socket = socketIOClient("http://localhost:3100");

var loggedIn = false;

export default class DashboardUpdate extends Component {
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
        return <Chats usersThreads={threads} userInfo={userInfo} />;
      case "contacts":
        return <Contacts userInfo={userInfo} />;
      default:
        return "";
    }
  };

  componentWillMount() {
    this.userLoggedIn();
    this.fetchUserThreads();
  }

  render() {
    const { handleSelection, displayWindow, userLoggedIn} = this;
    const {userInfo} = this.state
    if(loggedIn){
      return (
        <Grid bsClass="dashboard-container">
        <Row bsClass='leftside-navbar'>
        <Col>
        <div
        className='user-profile-img-container'
        >
            <img 
            src={`https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/30821925_204356536843208_2842258653858203098_o.jpg?_nc_cat=0&oh=54b74a965018171b01d5101e362b5c85&oe=5B8A54A1`}  
            className='user-profile-img'/>
        </div>
        </Col>
            <Col> 
            <div
                className="component-box"
                id="chats"
                onClick={handleSelection}
              >
                <h3 id="chats">Chats</h3>
              </div>
            </Col>
            <Col>
            <div
                className="component-box"
                id="contacts"
                onClick={handleSelection}
              >
                <h3 id="contacts">Contacts</h3>
              </div>
            </Col>

            <Col> 
            <div
                className="component-box"
                id="status"
                onClick={handleSelection}
              >
                <h3 id="status">Status </h3>
              </div>
            </Col>
            <Col>
            <div
                className="component-box"
                id="status"
                onClick={handleSelection}
              >
                <h3 id="status">Settings</h3>
              </div>
            </Col>
        </Row>

         <Row>
              <div className="display-box">{displayWindow()}</div>
        </Row>
        </Grid>
      );
    }else{
      return <Redirect to='/' />
    }

    } 
}



/**
 * <Col bsClass='column-components'>
            <Row bsClass="component-container">
          
              <div
                className="component-box"
                id="chats"
                onClick={handleSelection}
              >
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
            </Col>
 */
