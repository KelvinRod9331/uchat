import React, { Component } from "react";
// import "./Form.css";
import { Link , Redirect } from "react-router-dom";
import axios from 'axios'
import {
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  DropdownButton,
  MenuItem
} from "react-bootstrap";


export default class Registration extends Component {
  state = {
    emailInput: "",
    fullNameInput: "",
    usernameInput: "",
    passwordInput: "",
    confirmInput: "",
    message: "",
    registered: false,
    alert: false,
    languages: [],
    countries: [],
    lanSelected: '',
    conSelected: ''
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

  handleLanguageSelector = e => {
    this.setState({
      lanSelected: e.target.value
    })
  }

  handleCountrySelector = e => {
    this.setState({
      conSelected: e.target.value
    })
  }

  
  submitForm = (e) => {
   e.preventDefault()
    const {
      emailInput,
      fullNameInput,
      usernameInput,
      passwordInput,
      confirmInput,
      message,
      registered,
      conSelected,
      lanSelected,
    } = this.state;

    axios
      .post("/register", {
        username: usernameInput,
        password: passwordInput,
        email: emailInput,
        fullname: fullNameInput,
        language: lanSelected,
        country: conSelected
      })
      .then(res => {
        console.log(res.data);
        this.setState({
          registered: true,
          confirmInput: "",
          submitted: true,
          emailInput: "",
          lanSelected: '',
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
          fullNameInput: '',
          lanSelected: '',
          conSelected: '',
          message: "Error inserting user"
        });
      });
  };

  componentDidMount(){
    axios
    .get('/lang')
    .then(res => {
      this.setState({
        languages: res.data.languages
      })
    })
    .catch(err => console.log('Couldnt Fetch Languages:', err))

    axios
    .get('/countries')
    .then(res => {
      this.setState({
        countries: res.data.countries
      })
    })
    .catch(err => console.log('Couldnt Fetch Languages:', err))
  }

  render() {
    const {
      emailInput,
      fullNameInput,
      usernameInput,
      passwordInput,
      confirmInput,
      message,
      registered,
      languages,
      lanSelected,
      countries
    } = this.state;

    const {
      submitForm,
      handleEmailChange,
      handleFullNameChange,
      handleUsernameChange,
      handleCountrySelector,
      handlePasswordChange,
      handleConfirmChange,
      handleLanguageSelector
    } = this;

      if (registered) {
        axios
        .post('/login', {
          username: usernameInput,
          password: passwordInput
        })
        .then(res => {
          this.setState({
            registered: false,
            usernameInput: '',
            passwordInput: ''
          });
        })
        .catch(err => {
          this.setState({
            message: 'username/password not found',
            registered: false
          });
        });

        return <Redirect to='/dashboard' />
        
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
                    onChange={handlePasswordChange}
                  />
                  <br />
                  <input
                    class="input"
                    id="login-password"
                    type="password"
                    name="confirm-input"
                    placeholder="Confirm Password"
                    value={confirmInput}
                    onChange={handleConfirmChange}
                  />
                  <br />

                   <FormControl
                  componentClass="select"
                  placeholder="select"
                  bsClass="formControlsSelect"
                  onChange={handleCountrySelector}
                  
                >
                  {countries.map((c, i) => {
                    return (
                      <option key={i} value={c.code}>
                        {c.name}
                      </option>
                    );
                  })}
                </FormControl>
                <br />

                  <FormControl
                  componentClass="select"
                  placeholder="select"
                  bsClass="formControlsSelect"
                  onChange={handleLanguageSelector}
                  
                >
                  {languages.map((lan, i) => {
                    return (
                      <option key={i} value={lan.abbreviation}>
                        {lan.name}
                      </option>
                    );
                  })}
                </FormControl>
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
