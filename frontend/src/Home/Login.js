import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import axios from "axios";
import { Form, Icon, Input, Button, Checkbox } from "antd";
import Loading from "./Loading";
import "./Home.css";
const FormItem = Form.Item;

export default class Login extends Component {
  state = {
    usernameInput: this.props.usernameInput || "",
    passwordInput: this.props.passwordInput || "",
    loggedIn: false,
    message: "",
    user: null,
    checked: false
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

        setTimeout(() => {
          this.setState({
            message: ""
          })
        }, 2000)
      });
  };

  componentDidMount() {
    axios
      .get("/singleUser")
      .then(res => {
        this.setState({
          user: res.data.data[0].username
        });
      })
      .catch(err => {
        this.setState({
          user: null
        });
      });
  }

  render() {
    const {
      usernameInput,
      passwordInput,
      message,
      loggedIn,
      user,
      checked,
    } = this.state;
    // eslint-disable-next-line
    const { submitForm } = this;

    if (loggedIn || user) {
      return <Redirect to="/" />;
    }

    return (
      <div className="login_container">
        <div className="loading_container">
          <Loading />
        </div>
        <div className="pageHeader">
          <h1 id="uchat-title">
            <strong>Welcome To Universal Chat</strong>
          </h1>
        </div>
        <div id="form_container">
          <div id="form_div">
            <Form onSubmit={this.submitForm} className="login-form">
              <FormItem>
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  value={usernameInput}
                  onChange={this.handleUsernameChange}
                  placeholder="Username"
                />
              </FormItem>
              <FormItem>
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="Password"
                  value={passwordInput}
                  onChange={this.handlePasswordChange}
                />
              </FormItem>
              <FormItem>
                <Checkbox
                value={checked}
                onClick={() => this.setState({checked: true})}
                >
                <strong>Remember me</strong>
                </Checkbox>
                <a className="login-form-forgot" href="/">
                 <strong>Forgot Password</strong> 
                </a>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Log in
                </Button>
               <strong>Or</strong> 
                {" "}
                <Link id="signup" to="/register">
                <strong id='register-tag'>Register</strong> 
                </Link>
              </FormItem>
            </Form>
          </div>
        <strong style={{color: "red"}}>{message}</strong>
        </div>
      </div>
    );
  }
}
