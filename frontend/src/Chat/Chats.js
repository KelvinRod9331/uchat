import React, { Component } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";
import { Grid, Row, Col } from "react-bootstrap";
import Search from "./Search";

const socket = socketIOClient("http://localhost:3100");

export default class Chats extends Component {
  componentDidMount(){
    socket.on("chat", () => this.props.fetchRecentMessage())
  }
  render() {
    const {
      usersThreads,
      currentUser,
      search,
      recentMsg,
      threadMessages,
      threadSelected,
      contactUser,
      openChatRoom,
      
    } = this.props;


    return (
      <Grid>
          <div className="search-placeholder">
            <Search
              userID={currentUser.id}
              search={search}
              usersThreads={usersThreads}
              openChatRoom={openChatRoom}
            />
          </div>
        <div className="threads-container">
          {usersThreads.map(thread => {
            let recentArr = recentMsg.filter(msg => {
              if (msg.thread_id === thread.id) {
                return msg;
              }
            });

            let recentObj = recentArr[recentArr.length - 1];
            if(recentObj){
              if(recentObj.receiver_message.split(' ').length > 5){
                let shortMsg = recentObj.receiver_message.split(' ').slice(0, 5).join(' ') + "..."
                recentObj.receiver_message = shortMsg
              }
            }
            if (currentUser.username === thread.user_one_name) {
              return (
                <div
                  className="individual-thread"
                  id={thread.id}
                  onClick={e => openChatRoom(e)}
                >
                  <div
                    className="contact-profile-pic-container"
                    id={thread.id}
                    onClick={e => openChatRoom(e)}
                  >
                    <img
                      className="contact-profile-pic "
                      id={thread.id}
                      src={thread.profile_pic}
                    />
                  </div>
                  <div className="contact-info-container" id={thread.id}>
                    <span className="contact-username" id={thread.id}>
                      {thread.user_two_name}
                    </span>
                    <br />
                    <span id={thread.id}>
                      {recentObj ? recentObj.receiver_message : ""}
                    </span>
                  </div>

                  <div className="borderBottom"></div>
                </div>
              );
            } else if (currentUser.username === thread.user_two_name) {
              return (
                <div
                  className="individual-thread"
                  id={thread.id}
                  onClick={e => openChatRoom(e)}
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
                    />
                  </div>
                  <div className="contact-info-container" id={thread.id}>
                    <span className="contact-username" id={thread.id}>
                      {thread.user_one_name}
                    </span>
                    <br />
                    <span id={thread.id}>
                      {recentObj ? recentObj.receiver_message : ""}
                    </span>
                  </div>
                  <div className="borderBottom"></div>
                </div>
              );
            }
          })}
        </div>
      </Grid>
    );
  }
}


  