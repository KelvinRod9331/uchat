import React, { Component } from "react";
import axios from "axios";
import { Grid, Row, Col } from "react-bootstrap";
import ChatRoom from "./ChatRoom/ChatRoom";
import Search from "./Search";

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

    this.setState(
      {
        threadSelected: threadSelected
      },
      () => this.fetchConversation(threadSelected.id)
    );
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

  
  render() {
    const { usersThreads, currentUser, search, recentMsg} = this.props;
    const { threadMessages, threadSelected } = this.state;

    console.log('recentMsg', recentMsg)
    return (
      <Grid>
        <div className="threads-container">
          <div className="search-placeholder">
            <Search
              userID={currentUser.id}
              search={search}
              usersThreads={usersThreads}
              openChatRoom={this.openChatRoom}
            />
          </div>
          {usersThreads.map(thread => {
            
           let recentArr = recentMsg.filter(msg => {
              if(msg.thread_id === thread.id){
                return msg
              }
            })
            
            let recentObj = recentArr[recentArr.length - 1]
 
            return (
              <div
                className="individual-thread"
                id={thread.id}
                onClick={this.openChatRoom}
              >
                <span id={thread.id}>
                  <img
                    className="contact-profile-pic"
                    src={thread.profile_pic}
                    width="50px"
                  />
                </span>{" "}
                <span id={thread.id}>{thread.username}</span>{" "}
                <span id={thread.id}>{thread.language}</span> <div />
                <div>
                    {recentObj ? recentObj.receiver_message : ""}
                </div>
              </div>
            );
          })}
        </div>
        <Col bsClass="chatroom-container">
          <ChatRoom
            thread={threadSelected}
            threadMessages={threadMessages}
            Conversation={this.fetchConversation}
            currentUser={currentUser}
          />
        </Col>
      </Grid>
    );
  }
}
