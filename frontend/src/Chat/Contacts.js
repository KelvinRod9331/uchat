import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router";
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
    const { currentUser } = this.props;

    axios
      .post("/newThread", {
        user_id: currentUser.id,
        contact_id: e.target.id
      })
      .then(res => {
        this.setState({
          threadID: res.data.thread,
          threadCreated: true
        });
      })
      .catch(err => console.log("Could not create Thread"));
  };

  componentWillMount() {
    this.getUsersContacts();
  }

  render() {
    const { contactList, threadCreated, threadID } = this.state;
    const { createChatRoom } = this;
    const { currentUser, search } = this.props;

    if (threadCreated) {
      this.setState({
        threadCreated: false
      });
      return <Redirect to="/" />;
    }
    return (
      <div className="contactlist-container">
          <Search
            userID={currentUser.id}
            search={search}
            createChatRoom={createChatRoom}
          />
        {contactList.map(c => (
          <div
            // className="contacts-container"
            id={c.contact_id}
            onClick={this.createChatRoom}
            class={`flag-background flag-${c.country.toLowerCase()}`}
          >
            <div
            className="contact-profile-pic-container"
            >
              <img
              className="contact-profile-pic "
                id={c.contact_id}
                src={c.profile_pic}
              />
            </div>
            <div
            className='contact-info-container'
            >
            <span id={c.contact_id}> {c.username}</span>{" "}
            <span id={c.contact_id} ></span>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
