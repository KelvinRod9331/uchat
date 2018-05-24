import ReactDOM from "react-dom";
import React from "react";
import {Redirect} from 'react-router'
import { Modal, Popover, Button } from "antd";
import LogOut from '../UChatAPI'

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
    console.log(action);
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
        return LogOut.logOut().then(this.setState({logged: false}))

    default:
    return ''
    }
  };

  content = () => {
    return (
      <div>
        <div
          style={{ cursor: "pointer" }}
          id={"profile"}
          type='primary'
          onClick={this.showModal}
        >
          Profile
        </div>
        <div
          style={{ cursor: "pointer" }}
          id={"settings"}
          type='primary'
          onClick={this.showModal}
        >
         settings
        </div>
        <div
          style={{ cursor: "pointer" }}
          id={"logout"}
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

    if(!logged){
        <Redirect to ='/' />
    }
    
    return (
      <div>
        <Popover
          content={this.content()}
          trigger="click"
          visible={this.state.showMenu}
          onVisibleChange={this.handleVisibleChange}
          overlayStyle={{height: 100}}
        >
          <Button type="primary">
            <i  class="fas fa-ellipsis-v" />
          </Button>
        </Popover>
        {this.menuAction()}
      </div>
    );
  }
}

export default Menu;
