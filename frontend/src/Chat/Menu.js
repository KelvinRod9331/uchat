import React from "react";
import { Modal, Popover, Button, Icon } from "antd";
import LogOut from '../Home/Logout'

class Menu extends React.Component {
  state = {
    logged: true,
    showMenu: false,
    showModal: false,
    action: ""
  };

  showModal = e => {

    console.log(e.target.id)
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

  menuAction = () => {
    const { action } = this.state;
    switch (action) {
      case "profile":
        return (
          <div>
            <Modal
              title="Basic Modal"
              visible={this.state.showModal}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <p>Some contents...</p>
              <p>Some contents...</p>
              <p>Some contents...</p>
            </Modal>
          </div>
        );
        
        case "settings":
        return (
            <div>
              <Modal
                title="Basic Modal"
                visible={this.state.showModal}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
              </Modal>
            </div>
          );

           
        case "logout":
        return <LogOut />

    default:
    return ''
    }
  };

  content = () => {
    return (
      <div
      className='settings-options'
      >
        <div
          id="profile"
          type='primary'
          onClick={this.showModal}
        >
          Profile
        </div>
        <div
          id="settings"
          type='primary'
          onClick={this.showModal}
        >
         settings
        </div>
        <div
          id="logout"
          type='primary'
          onClick={this.showModal}
        >
         Log Out
        </div>
      </div>
    );
  };
  render() {

    const{logged} = this.state

   

    return (
      <div>
        <Popover
          content={this.content()}
          trigger="click"
          visible={this.state.showMenu}
          onVisibleChange={this.handleVisibleChange}
          overlayStyle={{height: 100}}
        >
        <Icon type="ellipsis" style={{ transform: "rotate(90deg)", fontSize: '170%'}}  />
        </Popover>
        {this.menuAction()}
      </div>
    );
  }
}

export default Menu;
