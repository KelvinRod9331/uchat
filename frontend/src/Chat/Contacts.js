import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router";

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
    const { userInfo } = this.props;

    axios
      .post("/newThread", {
        user_id: userInfo.id,
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

  componentDidMount() {
    this.getUsersContacts();
  }

  render() {
    const { contactList, threadCreated, threadID } = this.state;

    console.log(threadID);

    if (threadCreated) {
      this.setState({
        threadCreated: false
      });
      return <Redirect to="/chat" />;
    }
    return (
      <div className="contactlist-container">
        {contactList.map(c => (
          <div
            className="contacts-container"
            id={c.contact_id}
            onClick={this.createChatRoom}
          >
            <span id={c.contact_id}>
              <img src={c.profile_pic} width="80px" />
            </span>{" "}
            <span id={c.contact_id}>Username: {c.username}</span>{" "}
            <span id={c.contact_id}>Language: {c.language}</span>{" "}
          </div>
        ))}
      </div>
    );
  }
}
