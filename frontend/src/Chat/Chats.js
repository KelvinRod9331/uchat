import React, { Component } from "react";
import axios from "axios";
import { Grid, Row, Col } from "react-bootstrap";
import ChatRoom from "./ChatRoom";

export default class Chats extends Component {
  constructor() {
    super();
    this.state = {
      threadSelected: {}
    };
  }

  openChatRoom = e => {
    const { usersThreads } = this.props;
    console.log(e.target.id);
    let threadSelected = usersThreads.find(thread => {
      if (thread.id === Number(e.target.id)) {
        return thread;
      }
    });

    this.setState({
        threadSelected: threadSelected
    })
  };

  

  render() {
    const { usersThreads } = this.props;
    const { threadSelected } = this.state
    console.log("thread state", threadSelected)
   
    return (
      <Grid>
        <div className="threads-container">
          {usersThreads.map(thread => (
            <div
              className="individual-thread"
              id={thread.id}
              onClick={this.openChatRoom}
            >
              <span id={thread.id}>
                <img src={thread.profile_pic} width="50px" />
              </span>{" "}
              <span id={thread.id}>Username: {thread.username}</span>{" "}
              <span id={thread.id}>Language: {thread.language}</span>{" "}
            </div>
          ))}
        </div>
              <Col bsClass="chatroom-container">
              <ChatRoom thread={threadSelected}/>
              </Col>
      </Grid>
    );
  }
}
