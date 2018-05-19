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
    const { currentUser, allUsers } = this.props;
   
   let contactSelected = e.target.id

   let contact = allUsers.find( u => {
     return u.id === Number(contactSelected)
   })

    axios
      .post("/newThread", {
        user_id: currentUser.id,
        contact_id: contactSelected,
        user_one_name: currentUser.username,
        user_two_name: contact.username
      })
      .then(res => {
        this.setState({
          threadID: res.data.thread,
          threadCreated: true
        });
      })
      .catch(err => console.log("Could not create Thread"));

    console.log({contact: contact.username, contactSelected: contactSelected})

  };

  componentWillMount() {
    this.getUsersContacts();
  }

  render() {
    const { contactList, threadCreated, threadID } = this.state;
    const { createChatRoom } = this;
    const { currentUser, search } = this.props;

    console.log(contactList)

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
              className="contact-profile-pic "
                id={c.contact_id}
                src={c.profile_pic}
              />
            </div>
            <div
            className='contact-info-container'
            id={c.contact_id}
            >
            <span className='contact-username' id={c.contact_id}> {c.username}</span>{" "}<br/>
            <span id={c.contact_id} >{'Hey There! I Am Using UChat'}</span>
            </div>
            <div className={`flag-background flag-${c.country.toLowerCase()}`}/>
            
          </div>
        ))}
      </div>
    );
  }
}

