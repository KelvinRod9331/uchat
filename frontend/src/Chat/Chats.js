import React, { Component } from "react";
import axios from "axios";
import { Grid, Row, Col } from "react-bootstrap";
import ChatRoom from "./ChatRoom";

export default class Chats extends Component {
  constructor() {
    super();
    this.state = {
      threadSelected: {},
      threadMessages: []
    };
  }

  openChatRoom = e => {
    const { usersThreads } = this.props;
    let threadSelected = usersThreads.find(thread => {
      if (thread.id === Number(e.target.id)) {
        return thread;
      }
    });

    this.setState({
      threadSelected: threadSelected
    }, () => this.fetchConversation(threadSelected.id));
  };

  fetchConversation = (id) => {
    axios
      .get(`/messages/${id}`)
      .then(res => {
        this.setState({
          threadMessages: res.data.messages
        });
      })
      .catch(err => console.log("err", err));
  };


  render() {
    const { usersThreads, userInfo} = this.props;
    const { threadMessages, threadSelected } = this.state;
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
          <ChatRoom thread={threadSelected} threadMessages={threadMessages} Conversation={this.fetchConversation} userInfo={userInfo}/>
        </Col>
      </Grid>
    );
  }
}
