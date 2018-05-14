import React, { Component } from "react";
import axios from "axios";

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
      case "users":
        return this.fetchUsers();

      case "contacts":
        return this.getUsersContacts();

      case "conversation":
        return this.fetchUserThreads()
    }
  };

  fetchUsers = () => {
    axios
      .get("/allUsers")
      .then(res => {
        this.setState({
          results: res.data.allUsers
        });
      })
      .catch(err => console.log("Error", err));
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
    const { search, createChatRoom, openChatRoom } = this.props;

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
                className="contacts-container"
                id={contact.contact_id}
                onClick={e => this.setState({inputValue: ''}, createChatRoom(e)) }
              >
                <span id={contact.contact_id}>
                  <img src={contact.profile_pic} width="80px" />
                </span>{" "}
                <span id={contact.contact_id}>
                  Username: {contact.username}
                </span>{" "}
                <span id={contact.contact_id}>
                  Language: {contact.language}
                </span>{" "}
              </div>
            );
          }
        });

      case "users":
        return results.map(user => {
          if (
            user.username.toLowerCase().includes(inputValue.toLowerCase()) &&
            inputValue
          ) {
            return (
              <div className="contacts-container">
                <span>
                  <img src={user.profile_pic} width="80px" />
                </span>{" "}
                <span>Username: {user.username}</span>{" "}
                <span>Language: {user.language}</span>{" "}
                <button id={user.id} onClick={this.addToContactList}>
                  Friend Request
                </button>
              </div>
            );
          }
        });

      case "conversation":
        return results.map(thread => {
          if (
            thread.username.toLowerCase().includes(inputValue.toLowerCase()) &&
            inputValue
          ) {
            return (
              <div
                className="contacts-container"
                id={thread.id}
                onClick={e => this.setState({inputValue: ''},openChatRoom(e)) }
              >
                <span id={thread.id}>
                  <img
                    className="contact-profile-pic"
                    src={thread.profile_pic}
                    width="50px"
                  />
                </span>{" "}
                <span id={thread.id}>Username: {thread.username}</span>{" "}
                <span id={thread.id}>Language: {thread.language}</span>{" "}
              </div>
            );
          }
        });
    }
  };

  addToContactList = e => {
    const { userID } = this.props;
    let id = e.target.id;

    if (userID !== e.target.id) {
      axios
        .post("/addContact", {
          userID: userID,
          contactID: id
        })
        .then(() => {
          this.setState({
            message: "Sent A Friend Request"
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
        <div>{this.searchEngine()}</div>
      </div>
    );
  }
}
