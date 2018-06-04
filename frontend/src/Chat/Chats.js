/* eslint-disable */
import React, { Component } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";
import { Grid, Row, Col } from "react-bootstrap";
import Search from "./Search";

const socket = socketIOClient("http://localhost:3100");

export default class Chats extends Component {
  componentWillMount() {
    const { fetchRecentMessage, fetchUserThreads } = this.props;
    socket.on("chat", () => fetchRecentMessage());
    socket.on("chat", () => fetchUserThreads());
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
      openChatRoom
    } = this.props;

    return (
      <Grid>
        <div className="search-placeholder">
          <Search
            search={search}
            currentUser={currentUser}
            usersThreads={usersThreads}
            openChatRoom={openChatRoom}
            recentMsg={recentMsg}
          />
        </div>
        <div className="threads-container">
          {usersThreads.map(thread => {

            console.log(thread)
            let recentObj = recentMsg.find(msg => {
              if (msg.thread_id === thread.id) {
                return msg;
              }
            });

            if (recentObj && recentObj.receiver_message.split(" ").length > 5) {
              let shortMsg =
                recentObj.receiver_message
                  .split(" ")
                  .slice(0, 3)
                  .join(" ") + "...";

              recentObj.receiver_message = shortMsg;
            }

            if (currentUser.id === thread.user_one) {
             
              return (
                <div
                  className="individual-thread"
                  id={thread.id}
                  onClick={e => openChatRoom(e, 'chats')}
                >
                  <div
                    className="contact-profile-pic-container"
                    id={thread.id}
                    onClick={e => openChatRoom(e, 'chats')}
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
            } else if (currentUser.id === thread.user_two) {
              return (
                <div
                  className="individual-thread"
                  id={thread.id}
                  onClick={e => openChatRoom(e, 'chats')}
                >
                  <div
                    className="contact-profile-pic-container"
                    id={thread.id}
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
          })}
        </div>
      </Grid>
    );
  }
}
