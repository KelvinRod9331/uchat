import React, { Component } from "react";
// import "./Login.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { Redirect } from "react-router";

export default class Login extends Component {
  state = {
    usernameInput: this.props.usernameInput || "",
    passwordInput: this.props.passwordInput || "",
    loggedIn: false,
    message: "",
    user: null
  };

  /**
       * @func handleUserNameChange
       Handles the users value and Set the State to that value
       ~Kelvin
  */

  handleUsernameChange = e => {
    this.setState({
      usernameInput: e.target.value
    });
  };
  /**
       * @func handlePasswordChange
       Handles the users value/password and Set the State to that value
       ~Kelvin
  */

  handlePasswordChange = e => {
    this.setState({
      passwordInput: e.target.value
    });
  };
  /**
       * @func submitForm
       Submit/Post The Input to Database to retrieve User
       ~Kelvin
       */

  submitForm = e => {
    e.preventDefault();
    const { usernameInput, passwordInput } = this.state;

    axios
      .post("/login", {
        username: usernameInput,
        password: passwordInput
      })
      .then(res => {
        this.setState({
          loggedIn: true
        });
      })
      .catch(err => {
        this.setState({
          usernameInput: "",
          passwordInput: "",
          message: "username/password not found"
        });
      });
  };

  render() {
    const {
      usernameInput,
      passwordInput,
      message,
      loggedIn,
      user
    } = this.state;
    // eslint-disable-next-line
    const { submitForm } = this;

    if (loggedIn) {
      return <Redirect to="/chat" />;
    }
    
    return (
      <div className="login_container">
        <div className="pageHeader" />
        <div id="form_container">
          <p id="login">Log In</p>
          <div id="form_div">
            <form onSubmit={this.submitForm}>
              <input
                id="login-input"
                type="input"
                placeholder="Username or E-mail"
                name="username"
                value={usernameInput}
                onChange={this.handleUsernameChange}
              />
              <br />
              <input
                id="login-password"
                type="password"
                placeholder="Password"
                name="username"
                value={passwordInput}
                onChange={this.handlePasswordChange}
              />
              <br />
              <input id="login-submit" type="submit" value="Submit" />
              <p id="homPage-question">
                Don't have an account?{" "}
                <Link id="signup" to="/register">
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
        {message}
      </div>
    );
  }
}
