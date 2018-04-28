import React, { Component } from "react";
// import "./Form.css";
import { Link , Redirect } from "react-router-dom";
import axios from 'axios'


export default class Registration extends Component {
  state = {
    emailInput: "",
    fullNameInput: "",
    usernameInput: "",
    passwordInput: "",
    confirmInput: "",
    message: "",
    registered: false,
    alert: false
  };

  handleUsernameChange = e => {
    this.setState({
      usernameInput: e.target.value
    });
  };

  handlePasswordChange = e => {
    this.setState({
      passwordInput: e.target.value
    });
  };

  handleConfirmChange = e => {
    this.setState({
      confirmInput: e.target.value
    });
  };

  handleEmailChange = e => {
    this.setState({
      emailInput: e.target.value
    });
  };

  handleFullNameChange = e => {
    this.setState({
      fullNameInput: e.target.value
    });
  };

  
  submitForm = () => {
    const {
      emailInput,
      fullNameInput,
      usernameInput,
      passwordInput,
    } = this.props;


    axios
      .post("/signup", {
        username: usernameInput,
        password: passwordInput,
        email: emailInput,
        fullname: fullNameInput
      })
      .then(res => {
        console.log(res.data);
        this.setState({
          registered: true,
          usernameInput: "",
          passwordInput: "",
          confirmInput: "",
          submitted: true,
          emailInput: "",
          message: `Welcome to the site ${this.state.usernameInput}`
        });
      })
      .catch(err => {
        console.log("error: ", err);
        this.setState({
          usernameInput: "",
          passwordInput: "",
          confirmInput: "",
          emailInput: "",
          message: "Error inserting user"
        });
      });
  };

  render() {
    const {
      emailInput,
      fullNameInput,
      usernameInput,
      passwordInput,
      confirmInput,
      message,
      registered
    } = this.state;

    const {
      submitForm,
      handleEmailChange,
      handleFullNameChange,
      handleUsernameChange
    } = this;

    if (registered) {
        return <Redirect to="" />;
      }

    return (
            <div id="signup-form-container">
              <p id="signup-title">
                <strong>Sign Up To Chat With Anyone In The World</strong>
              </p>
              <div id="form-container">
                <form onSubmit={submitForm}>
                  <input
                    class="input"
                    id="login-input"
                    type="email"
                    name="Email"
                    placeholder="Email"
                    value={emailInput}
                    onChange={handleEmailChange}
                  />
                  <br />
                  <input
                    class="input"
                    id="login-input"
                    type="text"
                    name="Full name"
                    placeholder="Full name"
                    value={fullNameInput}
                    onChange={handleFullNameChange}
                  />
                  <br />
                  <input
                    class="input"
                    id="login-input"
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={usernameInput}
                    onChange={handleUsernameChange}
                  />
                  <br />
                  <input
                    class="input"
                    id="login-password"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={passwordInput}
                    onChange={this.handlePasswordChange}
                  />
                  <br />
                  <input
                    class="input"
                    id="login-password"
                    type="password"
                    name="confirm-input"
                    placeholder="Confirm Password"
                    value={confirmInput}
                    onChange={this.handleConfirmChange}
                  />
                  <br />
                  <input
                    class="input"
                    id="login-submit"
                    type="submit"
                    value="Sign Up"
                  />
                  <p>{message}</p>
                  <p id="question">
                    Have an account? <Link to="/login">Log In</Link>
                  </p>
                </form>
              </div>
            </div>
    );
  }
}
