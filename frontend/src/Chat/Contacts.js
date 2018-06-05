/* eslint-disable */
import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router";
import { Grid } from "react-bootstrap";
import Search from "./Search";

export default class Contacts extends Component {
  constructor() {
    super();
    this.state = {
      contactList: [],
      threadID: "",
      threadCreated: false
    };
  }

  getUsersContacts = () => {
    axios
      .get("/contacts")
      .then(res => {
        this.setState({
          contactList: res.data.contacts
        });
      })
      .catch(err => console.log("Couldn't Fetch User's Contacts:", err));
  };

  createChatRoom = e => {
    const {
      currentUser,
      allUsers,
      usersThreads,
      openChatRoom,
      fetchUserThreads
    } = this.props;

    console.log(usersThreads);

    let contactSelected = e.target.id;

    let contact = allUsers.find(u => {
      return u.id === Number(contactSelected);
    });

    let isChatRoomOpen = usersThreads.find(thread => {
      if (thread.user_two === contact.id) {
        return thread;
      } else if (thread.user_one === contact.id) {
        return thread;
      }
    });
    console.log("Over here", isChatRoomOpen, { contact: contact });
    console.log(!Boolean(isChatRoomOpen));
    if (!Boolean(isChatRoomOpen)) {
      axios
        .post("/newThread", {
          user_id: currentUser.id,
          contact_id: contactSelected,
          user_one_name: currentUser.username,
          user_two_name: contact.username,
          created: true
        })
        .then(res => {
          this.setState({ thread: res.data.thread }, () => fetchUserThreads());
          this.setState({ thread: res.data.thread }, () =>
            openChatRoom(res.data.thread, "contacts")
          );
        })
        .catch(err => console.log("Could not create Thread", err));
    } else {
      openChatRoom(isChatRoomOpen, "contacts");
    }
  };

  componentWillMount() {
    this.getUsersContacts();
  }

  render() {
    const { contactList, threadCreated, threadID } = this.state;
    const { createChatRoom } = this;
    const { currentUser, search } = this.props;

    return (
      <Grid>
        <Search
          userID={currentUser.id}
          search={search}
          createChatRoom={createChatRoom}
        />
        <div className="contactlist-container">
          {contactList.map(c => (
            <div
              className="contacts-container"
              id={c.contact_id}
              onClick={this.createChatRoom}
            >
              <div
                className="contact-profile-pic-container"
                id={c.contact_id}
                onClick={this.createChatRoom}
              >
                <img
                  className="contact-profile-pic"
                  id={c.contact_id}
                  src={c.profile_pic}
                />
              </div>
              <div className="contact-info-container" id={c.contact_id}>
                <span className="contact-username" id={c.contact_id}>
                  {" "}
                  {c.username}
                </span>{" "}
                <br />
                <span id={c.contact_id}>{c.about}</span>
              </div>
              <div
                className={`flag-background flag-${c.country.toLowerCase()}`}
              />

              <div className="borderBottom" />
            </div>
          ))}
        </div>
      </Grid>
    );
  }
}
