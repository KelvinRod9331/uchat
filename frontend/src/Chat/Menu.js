import React from "react";
import { Modal, Popover, Button, Input, Icon } from "antd";
import LogOut from "../Home/Logout";
import Update from "../UChatAPI"
class Menu extends React.Component {
  state = {
    logged: true,
    showMenu: false,
    showModal: false,
    action: "",
    userName: '',
    about: '',
    message: '',
    email: ''
  };

  showModal = e => {
    console.log(e.target.id);
    this.setState({
      showModal: true,
      action: e.target.id,
      showMenu: false
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      showModal: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      showModal: false
    });
  };

  hide = () => {
    this.setState({
      showMenu: false
    });
  };

  handleVisibleChange = showMenu => {
    this.setState({ showMenu });
  };

  emitEmpty = () => {
    this.userNameInput.focus();
    this.setState({ userName: '' });
  }

  onChangeUserName = (e) => {
    this.setState({ userName: e.target.value});
  }

  onChangeUserAbout = (e) => {
      this.setState({ about: e.target.value })
  }


  updateUserInfo = () => {
    const { userName, about, email } = this.state
    const { currentUser } = this.props;

    
      Update.updateUserInfo({
        username: userName?userName:currentUser.username,
        full_name: currentUser.full_name,
        email: email?email:currentUser.email,
        about: about?about:currentUser.about,
        id: currentUser.id,
        type: 'user-info'
      })
      .then(() => {
          this.setState({message: 'Your info has been updated'})
      })
  }

  menuAction = () => {
    const { action, userName, about } = this.state;
    const { currentUser } = this.props;
    switch (action) {
      case "profile":
      const suffix = userName ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
        return (
          <div>
            <Modal
              title="Profile"
              visible={this.state.showModal}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            //   width={300}
              bodyStyle={{height: '300px'}}
            >
              <div>Change Photo Here</div>
              <div>
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
             
             <div>
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

              <Button type="primary" onClick={this.updateUserInfo}>Submit</Button>
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
              <div />
              <p>Some contents...</p>
              <p>Some contents...</p>
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
    const { logged } = this.state;

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
      </div>
    );
  }
}

export default Menu;
