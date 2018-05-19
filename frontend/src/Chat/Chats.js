import React, { Component } from "react";
import axios from "axios";
import { Grid, Row, Col } from "react-bootstrap";
// import ChatRoom from "./ChatRoom/ChatRoom";
import Search from "./Search";

export default class Chats extends Component {
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
        <div className="threads-container">
          <div className="search-placeholder">
            <Search
              userID={currentUser.id}
              search={search}
              usersThreads={usersThreads}
              openChatRoom={openChatRoom}
            />
          </div>
          {usersThreads.map(thread => {
            let recentArr = recentMsg.filter(msg => {
              if (msg.thread_id === thread.id) {
                return msg;
              }
            });

            let recentObj = recentArr[recentArr.length - 1];
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
                </div>
              );
            }
          })}
        </div>
      </Grid>
    );
  }
}

{
  /* <Col bsClass="chatroom-container">
  <ChatRoom
    thread={threadSelected}
    threadMessages={threadMessages}
    Conversation={this.fetchConversation}
    currentUser={currentUser}
    contactUser={contactUser}
  />
</Col> */
  // import React, { Component } from "react";
  // import socketIOClient from "socket.io-client";
  // import axios from "axios";
  // import { Grid, Row, Col } from "react-bootstrap";
  // import ChatRoom from "./ChatRoom/ChatRoom";
  // import Search from "./Search";
  // const socket = socketIOClient("http://localhost:3100");
  // export default class Chats extends Component {
  //   constructor() {
  //     super();
  //     this.state = {
  //       threadSelected: {},
  //       threadMessages: [],
  //       contactUser: {}
  //     };
  //   }
  //   openChatRoom = e => {
  //     const { usersThreads } = this.props;
  //     let threadSelected = usersThreads.find(thread => {
  //       if (thread.id === Number(e.target.id)) {
  //         return thread;
  //       }
  //     });
  //     this.setState(
  //       {
  //         threadSelected: threadSelected
  //       },
  //       () => this.getUserByID(threadSelected)
  //     );
  //   };
  //   getUserByID = (thread) => {
  //     const { currentUser } = this.props;
  //     if (thread.user_one === currentUser.id) {
  //       axios
  //         .get(`/userByID/${thread.user_two}`)
  //         .then(res => {
  //           this.setState(
  //             {
  //               contactUser: res.data.user[0]
  //             },
  //             () => this.fetchConversation(thread.id)
  //           );
  //         })
  //         .catch(err => console.log(err));
  //     } else {
  //       axios
  //         .get(`/userByID/${thread.user_one}`)
  //         .then(res => {
  //           this.setState(
  //             {
  //               contactUser: res.data.user[0]
  //             },
  //             () => this.fetchConversation(thread.id)
  //           );
  //         })
  //         .catch(err => console.log(err));
  //     }
  //   };
  //   fetchConversation = id => {
  //     axios
  //       .get(`/messages/${id}`)
  //       .then(res => {
  //         this.setState({
  //           threadMessages: res.data.messages
  //         });
  //       })
  //       .catch(err => console.log("err", err));
  //   };
  //   render() {
  //     const { usersThreads, currentUser, search, recentMsg } = this.props;
  //     const { threadMessages, threadSelected, contactUser } = this.state;
  //     return (
  //       <Grid>
  //         <div className="threads-container">
  //           <div className="search-placeholder">
  //             <Search
  //               userID={currentUser.id}
  //               search={search}
  //               usersThreads={usersThreads}
  //               openChatRoom={this.openChatRoom}
  //             />
  //           </div>
  //           {usersThreads.map(thread => {
  //             let recentArr = recentMsg.filter(msg => {
  //               if (msg.thread_id === thread.id) {
  //                 return msg;
  //               }
  //             });
  //             let recentObj = recentArr[recentArr.length - 1];
  //             if(currentUser.username === thread.user_one_name){
  //               return (
  //                 <div
  //                   className="individual-thread"
  //                   id={thread.id}
  //                   onClick={this.openChatRoom}
  //                 >
  //                   <span id={thread.id}>
  //                     <img
  //                       id={thread.id}
  //                       className="contact-profile-pic"
  //                       src={thread.profile_pic}
  //                       width="50px"
  //                     />
  //                   </span>{" "}
  //                   <span id={thread.id}>{thread.user_two_name}</span>{" "}
  //                   <span id={thread.id}>{thread.language}</span> <div />
  //                   <div id={thread.id}>
  //                     {recentObj ? recentObj.receiver_message : ""}
  //                   </div>
  //                 </div>
  //               );
  //             }else if(currentUser.username === thread.user_two_name){
  //               return (
  //                 <div
  //                   className="individual-thread"
  //                   id={thread.id}
  //                   onClick={this.openChatRoom}
  //                 >
  //                   <span id={thread.id}>
  //                     <img
  //                       id={thread.id}
  //                       className="contact-profile-pic"
  //                       src={thread.profile_pic}
  //                       width="50px"
  //                     />
  //                   </span>{" "}
  //                   <span id={thread.id}>{thread.user_one_name}</span>{" "}
  //                   <span id={thread.id}>{thread.language}</span> <div />
  //                   <div id={thread.id}>
  //                     {recentObj ? recentObj.receiver_message : ""}
  //                   </div>
  //                 </div>
  //               );
  //             }
  //           })}
  //         </div>
  //         <Col bsClass="chatroom-container">
  //           <ChatRoom
  //             thread={threadSelected}
  //             threadMessages={threadMessages}
  //             Conversation={this.fetchConversation}
  //             currentUser={currentUser}
  //             contactUser={contactUser}
  //           />
  //         </Col>
  //       </Grid>
  //     );
  //   }
  // }
}
