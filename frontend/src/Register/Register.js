/* eslint-disable */
import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete
} from "antd";
import "./Register.css";
import Loading from "../Home/Loading";

const FormItem = Form.Item;
const Option = Select.Option;

export default Form.create()(
  class Registration extends Component {
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
      lanSelected: "en",
      conSelected: "US",
      confirmDirty: false
    };

    handleConfirmBlur = e => {
      const value = e.target.value;
      this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value, callback) => {
      const form = this.props.form;
      if (value && value !== form.getFieldValue("password")) {
        callback("Two passwords that you enter is inconsistent!");
      } else {
        callback();
      }
    };

    validateToNextPassword = (rule, value, callback) => {
      const form = this.props.form;
      if (value && this.state.confirmDirty) {
        form.validateFields(["confirm"], { force: true });
      }
      callback();
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

    handleLanguageSelector = value => {
      this.setState({
        lanSelected: value
      });
    };

    handleCountrySelector = value => {
      this.setState({
        conSelected: value
      });
    };

    submitForm = e => {
      e.preventDefault();
      const {
        emailInput,
        fullNameInput,
        usernameInput,
        passwordInput,
        confirmInput,
        message,
        registered,
        conSelected,
        lanSelected
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
            lanSelected: "",
            message: `Welcome to the site ${this.state.usernameInput}`
          });
        })
        .catch(err => {
          console.log("error: ", err);

          this.props.form.setFieldsValue({
            email: "",
            password: "",
            confirm: ""
          });
          this.setState({
            usernameInput: "",
            passwordInput: "",
            confirmInput: "",
            emailInput: "",
            fullNameInput: "",
            lanSelected: "",
            conSelected: "",
            message: "Error inserting user"
          });
        });
    };

    componentDidMount() {
      axios
        .get("/lang")
        .then(res => {
          this.setState({
            languages: res.data.languages
          });
        })
        .catch(err => console.log("Couldnt Fetch Languages:", err));

      axios
        .get("/countries")
        .then(res => {
          this.setState({
            countries: res.data.countries
          });
        })
        .catch(err => console.log("Couldnt Fetch Languages:", err));
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
          .post("/login", {
            username: usernameInput,
            password: passwordInput
          })
          .then(res => {
            this.setState({
              registered: false,
              usernameInput: "",
              passwordInput: ""
            });
          })
          .catch(err => {
            this.setState({
              message: "username/password not found",
              registered: false
            });
          });

        return <Redirect to="/dashboard" />;
      }

      const { getFieldDecorator } = this.props.form;
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      };

      const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0
          },
          sm: {
            span: 16,
            offset: 0
          }
        }
      };

      // const prefixSelector = getFieldDecorator("prefix", {
      //   initialValue: "86"
      // })(
      //   <Select style={{ width: 70 }}>
      //     <Option value="86">+86</Option>
      //     <Option value="87">+87</Option>
      //   </Select>
      // );

      return (
        <div id="signup-form-container">
          <div className="pageHeader_register">
            <h2 id="uchat-title">
              <strong>Welcome To Universal Chat</strong>
            </h2>
          </div>
          <div className="loading_container loading_container_register">
            <Loading />
          </div>
          <Form
            style={{ color: "white" }}
            id="register-form"
            onSubmit={submitForm}
          >
            <FormItem {...formItemLayout}>
              {getFieldDecorator("email", {
                rules: [
                  {
                    type: "email",
                    message: "The input is not valid E-mail!"
                  },
                  {
                    required: true,
                    message: "Please input your E-mail!"
                  }
                ]
              })(<Input onChange={handleEmailChange} placeholder="E-Mail" />)}
            </FormItem>
            <FormItem {...formItemLayout}>
              {getFieldDecorator("password", {
                rules: [
                  {
                    required: true,
                    message: "Please input your password!",
                    whitespace: true
                  },
                  {
                    validator: this.validateToNextPassword
                  }
                ]
              })(
                <Input
                  type="password"
                  onChange={handlePasswordChange}
                  placeholder="Password"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout}>
              {getFieldDecorator("confirm", {
                rules: [
                  {
                    required: true,
                    message: "Please confirm your password!"
                  },
                  {
                    validator: this.compareToFirstPassword
                  }
                ]
              })(
                <Input
                  type="password"
                  onBlur={this.handleConfirmBlur}
                  onChange={handleConfirmChange}
                  placeholder="Confirm Password"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} required={true}>
              <Input
                value={fullNameInput}
                onChange={handleFullNameChange}
                placeholder="Full Name"
              />
            </FormItem>
            <FormItem {...formItemLayout} required={true}>
              <Input
                value={usernameInput}
                onChange={handleUsernameChange}
                placeholder="Username"
              />
            </FormItem>
            <FormItem required={true} {...formItemLayout}>
              <Select
                defaultValue="Select Language"
                onChange={handleLanguageSelector}
                style={{ width: 330 }}
                dropdownClassName="language-dropdown"
              >
                {languages.map((lan, i) => {
                  return (
                    <Option key={i.toString(36) + i} value={lan.abbreviation}>
                      {lan.name}
                    </Option>
                  );
                })}
              </Select>
            </FormItem>
            <FormItem required={true} {...formItemLayout}>
              <Select
                defaultValue="US"
                defaultValue="Select Region"
                onChange={handleCountrySelector}
                style={{ width: 330 }}
                dropdownClassName="region-dropdown"
              >
                {countries.map((c, i) => {
                  return (
                    <Option key={i.toString(36) + i} value={c.code}>
                      {c.name}
                    </Option>
                  );
                })}
              </Select>
            </FormItem>
            {/* <FormItem
        {...formItemLayout}
        label="Phone Number"
      >
        {getFieldDecorator('phone', {
          rules: [{ required: true, message: 'Please input your phone number!' }],
        })(
          <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
        )}
      </FormItem> */}
            {/* <FormItem
        {...formItemLayout}
        label="Captcha"
        extra="We must make sure that your are a human."
      >
        <Row gutter={8}>
          <Col span={12}>
            {getFieldDecorator('captcha', {
              rules: [{ required: true, message: 'Please input the captcha you got!' }],
            })(
              <Input />
            )}
          </Col>
          <Col span={12}>
            <Button>Get captcha</Button>
          </Col>
        </Row>
      </FormItem> */}
            {/* <FormItem {...tailFormItemLayout}>
        {getFieldDecorator('agreement', {
          valuePropName: 'checked',
        })(
          <Checkbox>I have read the <a href="">agreement</a></Checkbox>
        )}
      </FormItem> */}
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                Register
              </Button>
            </FormItem>
            <p id="question">
              Have an account? <Link to="/login">Log In</Link>
            </p>
          </Form>
        </div>
      );
    }
  }
);
