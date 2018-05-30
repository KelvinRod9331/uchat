import React from "react";
import { Modal, Popover, Button, Input, Icon } from "antd";
import LogOut from "../Home/Logout";
import UChat from "../UChatAPI";

class Menu extends React.Component {
  state = {
    logged: true,
    showMenu: false,
    showModal: false,
    showPhotoOp: false,
    showPhotoModal: false,
    showUploadPhotoModal: false,
    action: "",
    type: "",
    userName: "",
    about: "",
    message: "",
    email: "",
    url: ""
  };

  showModal = e => {
    console.log(e.target.id);
    this.setState({
      showModal: true,
      action: e.target.id,
      showMenu: false
    });
  };

  handleCancel = () => {
    this.setState({
      showModal: false
    });
  };

  handlePhotoViewCancel = () => {
    this.setState({ showPhotoModal: false });
  };

  hide = () => {
    this.setState({
      showMenu: false
    });
  };

  handleVisibleChange = showMenu => {
    this.setState({ showMenu });
  };

  handleVisiblePhotoChange = showPhotoOp => {
    this.setState({ showPhotoOp });
  };

  emitEmpty = () => {
    this.userNameInput.focus();
    this.setState({ userName: "" });
  };

  onChangeUserName = e => {
    this.setState({ userName: e.target.value });
  };

  onChangeUserAbout = e => {
    this.setState({ about: e.target.value });
  };

  onChangeUserEmail = e => {
    this.setState({ email: e.target.value });
  };

  onChangeUserPassword = e => {
    this.setState({ password: e.target.value });
  };

  onChangeUserImgUrl = e => {
    this.setState({ url: e.target.value });
  };

  updateUserInfo = () => {
    const { userName, about, email } = this.state;
    const { currentUser, userLoggedIn } = this.props;

    UChat.updateUserInfo({
      username: userName ? userName : currentUser.username,
      full_name: currentUser.full_name,
      email: email ? email : currentUser.email,
      about: about ? about : currentUser.about,
      id: currentUser.id,
      type: "user-info"
    })
      .then(() => {
        this.setState(
          {
            message: "Your info has been updated",
            showModal: false,
            userName: "",
            email: "",
            about: "",
            password: ""
          },
          () => userLoggedIn()
        );
      })
      .catch(err => {
        this.setState({
          message: "Failed To Update",
          showModal: false,
          userName: "",
          email: "",
          about: ""
        });
      });
  };

  uploadPhotoToDB = () => {
    const { url } = this.state;
    const { userLoggedIn } = this.props;
    console.log('url',url)
    if (url) {
      UChat.uploadImgUrl({
        url:url
      })
        .then(() => {
          this.setState(
            {
              message: "Your Photo Has Been Uploaded",
              showUploadPhotoModal: false,
              url: ""
            },
            () => userLoggedIn()
          );
        })
        .catch(err => {
          console.log("Error Uploading URL", err)
          this.setState({
            message: "Your Photo Couldn't Uploaded",
            showUploadPhotoModal: false,
            url: ""
          });
        });
    }
  };

  viewFullScreenImage = () => {
    const { type, showPhotoModal, showUploadPhotoModal, url } = this.state;
    const { currentUser } = this.props;

    switch (type) {
      case "view-photo":
        return (
          <div>
            <Modal
              visible={showPhotoModal}
              style={{ marginTop: "-5%" }}
              onCancel={this.handlePhotoViewCancel}
              footer={null}
              bodyStyle={{ height: "650px" }}
              width={"600px"}
            >
              <img
                src={currentUser.profile_pic}
                className="fullscreen-photo-view"
                alt=''
              />
            </Modal>
          </div>
        );
      case "take-photo":
        return;
      case "upload-photo":
        return (
          <div>
            <Modal
              visible={showUploadPhotoModal}
              style={{ marginTop: "-5%" }}
              onCancel={() => this.setState({ showUploadPhotoModal: false })}
              footer={[<Button onClick={this.uploadPhotoToDB}>OK</Button>]}
            >
              <Input
                addonBefore="Http://"
                value={url}
                onChange={this.onChangeUserImgUrl}
              />
            </Modal>
          </div>
        );
      case "delete-photo":
        return;

      default:
      break
    }
  };

  imageContent = () => {
    return (
      <div className="settings-options">
        <div
          id="view-photo"
          type="primary"
          onClick={() =>
            this.setState({
              showPhotoModal: true,
              showPhotoOp: false,
              type: "view-photo"
            })
          }
        >
          View Photo
        </div>
        <div id="settings" type="primary" >
          Take Photos
        </div>
        <div
          type="primary"
          onClick={() =>
            this.setState({
              showUploadPhotoModal: true,
              showPhotoOp: false,
              type: "upload-photo"
            })
          }
        >
          Upload Photo
        </div>
        <div id="remove-photo" type="primary" >
          Remove Photo
        </div>
      </div>
    );
  };

  menuAction = () => {
    const {
      action,
      userName,
      about,
      email,
      password,
      showPhotoOp
    } = this.state;
    const { currentUser } = this.props;
    switch (action) {
      case "profile":
        const suffix = userName ? (
          <Icon type="close-circle" onClick={this.emitEmpty} />
        ) : null;
        return (
          <div>
            <Modal
              title="Profile"
              visible={this.state.showModal}
              onOk={this.updateUserInfo}
              onCancel={this.handleCancel}
              style={{ margin: "-5% 0 0 30%" }}
              bodyStyle={{ height: "500px" }}
            >
              <div className="img-update" onClick={this.handleImageOptions}>
                <Popover
                  content={this.imageContent()}
                  trigger="click"
                  placement="rightBottom"
                  visible={showPhotoOp}
                  onVisibleChange={this.handleVisiblePhotoChange}
                  overlayStyle={{ height: 100 }}
                >
                  <img
                    src={currentUser.profile_pic}
                    className="user-img-update"
                    alt=''
                  />
                </Popover>
              </div>
              <div className="username-update">
                <h3>Username</h3>
                <Input
                  placeholder={currentUser.username}
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  suffix={suffix}
                  value={userName}
                  onChange={this.onChangeUserName}
                  ref={node => (this.userNameInput = node)}
                />
              </div>

              <div className="about-update">
                <h3>About</h3>
                <Input
                  placeholder={currentUser.about}
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  suffix={suffix}
                  value={about}
                  onChange={this.onChangeUserAbout}
                  ref={node => (this.userNameInput = node)}
                />
              </div>

              <div className="emil-update">
                <h3>Email</h3>
                <Input
                  placeholder={currentUser.email}
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  suffix={suffix}
                  value={email}
                  onChange={this.onChangeUserEmail}
                  ref={node => (this.userNameInput = node)}
                />
              </div>
            </Modal>
          </div>
        );

      case "settings":
        return (
          <div>
            <Modal
              title="Change Settings"
              visible={this.state.showModal}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <div className="password-update">
                <h3>Password</h3>
                <Input
                  placeholder="Password"
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  suffix={suffix}
                  value={password}
                  id="password"
                  onChange={this.onChangeUserPassword}
                  ref={node => (this.userNameInput = node)}
                />
              </div>
            </Modal>
          </div>
        );

      case "logout":
        return <LogOut />;

      default:
        return "";
    }
  };

  content = () => {
    return (
      <div className="settings-options">
        <div id="profile" type="primary" onClick={this.showModal}>
          Profile
        </div>
        <div id="settings" type="primary" onClick={this.showModal}>
          Settings
        </div>
        <div id="logout" type="primary" onClick={this.showModal}>
          Log Out
        </div>
      </div>
    );
  };
  render() {
    return (
      <div>
        <Popover
          content={this.content()}
          trigger="click"
          visible={this.state.showMenu}
          onVisibleChange={this.handleVisibleChange}
          overlayStyle={{ height: 100 }}
        >
          <Icon
            type="ellipsis"
            style={{ transform: "rotate(90deg)", fontSize: "170%" }}
          />
        </Popover>
        {this.menuAction()}
        {this.viewFullScreenImage()}
      </div>
    );
  }
}

export default Menu;
