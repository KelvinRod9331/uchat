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

  componentWillMount() {
    this.fetchUsers();
  }

  searchEngine = () => {
    const { inputValue, results } = this.state;
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
  };

  addToContactList = e => {
    const { userID } = this.props;
    let id = e.target.id;
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
  };

  render() {
    const { inputValue } = this.state;
    console.log(this.searchEngine());
    console.log("Input Value", inputValue);
    return (
      <div>
        <form>
          <span
          id='search-icon'
          >
          <i class="fas fa-search"></i>
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
