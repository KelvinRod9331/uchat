import React, { Component } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";
const socket = socketIOClient("http://localhost:3100");

export default class Search extends Component {
  constructor() {
    super();
    this.state = {
      results: [],
      inputValue: "",
      message: ""
    };
  }

  determineAction = () => {
    const { search } = this.props;

    switch (search) {
      case "contacts":
        return this.getUsersContacts();

      case "conversation":
        return this.fetchUserThreads();
    }
  };

 

  getUsersContacts = () => {
    axios
      .get("/contacts")
      .then(res => {
        this.setState({
          results: res.data.contacts
        });
      })
      .catch(err => console.log("Couldn't Fetch User's Contacts:", err));
  };

  fetchUserThreads = () => {
    axios
      .get("/threads")
      .then(res => {
        this.setState({
          results: res.data.threads
        });
      })
      .catch(err => console.log("Error:", err));
  };

  searchEngine = () => {
    const { inputValue, results } = this.state;
    const { search, createChatRoom, openChatRoom, allUsers } = this.props;

    console.log("Search Comp", results);

    switch (search) {
      case "contacts":
        return results.map(contact => {
          if (
            contact.username.toLowerCase().includes(inputValue.toLowerCase()) &&
            inputValue
          ) {
            return (
              <div
                // className="contacts-container"
                id={contact.contact_id}
                onClick={e =>
                  this.setState({ inputValue: "" }, createChatRoom(e))
                }
                class={`flag-background flag-${contact.country.toLowerCase()}`}
              >
                <div className="contact-profile-pic-container">
                  <img
                    className="contact-profile-pic "
                    id={contact.contact_id}
                    src={contact.profile_pic}
                  />
                </div>
                <div className="contact-info-container">
                  <span id={contact.contact_id}> {contact.username}</span>{" "}
                  <span id={contact.contact_id} />
                </div>
              </div>
            );
          }
        });

      case "users":
        return allUsers.map(user => {
          if (
            user.username.toLowerCase().includes(inputValue.toLowerCase()) &&
            inputValue
          ) {
            return (
              
            <div
              // className="contacts-container"
              id={user.contact_id}
              class={`flag-background flag-${user.country.toLowerCase()}`}
            >
              <div className="contact-profile-pic-container">
                <img
                  className="contact-profile-pic "
                  id={user.contact_id}
                  src={user.profile_pic}
                />
              </div>
              <div className="contact-info-container">
                <span id={user.contact_id}> {user.username}</span>{" "}
                <span id={user.contact_id} />
                <button id={user.id} onClick={this.addToContactList}>
                  Friend Request
                </button>
              </div>
            </div>
            );

          }
        });

      case "conversation":
        return results.map(thread => {
          if (
            thread.user_two_name.toLowerCase().includes(inputValue.toLowerCase()) &&
            inputValue
          ) {
            return (
              <div
                className="contacts-container"
                id={thread.id}
                onClick={e =>
                  this.setState({ inputValue: "" }, openChatRoom(e))
                }
              >
                <span id={thread.id}>
                  <img
                    className="contact-profile-pic"
                    src={thread.profile_pic}
                    width="50px"
                  />
                </span>{" "}
                <span id={thread.id}>Username: {thread.user_two_name}</span>{" "}
                <span id={thread.id}>Language: {thread.language}</span>{" "}
              </div>
            );
          }
        });
    }
  };

  addToContactList = e => {
    const { currentUser } = this.props;
    let id = e.target.id;

    if (currentUser.id !== e.target.id) {
      axios
        .post("/addContact", {
          userID: currentUser.id,
          contactID: id
        })
        .then(() => {
          socket.emit("notify", {
            action: 'friend-request',
            username: currentUser.username,
          });
        })
        .catch(err => {
          console.log("Error Adding Contact To List", err);
        });
    }
  };

  componentDidMount() {
    this.determineAction();
  }

  render() {
    const { inputValue } = this.state;
    let style = {}
    if(inputValue){
        style = {
            paddingTop: "10%",
            backgroundColor: "white",
            zIndex: "3",
            position: "absolute",
            height: "97%",
            width: "47vh"
          }
    }

    
    return (
      <div className="search-placeholder">
        <form>
          <span id="search-icon">
            <i class="fas fa-search" />
          </span>
          <span>
            <input
              type="text"
              className="search-inputbox"
              placeholder="Search For Chat Or Person"
              value={inputValue}
              onChange={e => this.setState({ inputValue: e.target.value })}
            />
          </span>
        </form>
        <div 
        className='search-results'
        style={style}
        >{this.searchEngine()}</div>
      </div>
    );
  }
}
