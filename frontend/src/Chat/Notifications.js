import React from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";
import {
  Modal,
  Popover,
  Button,
  Input,
  Icon,
  Badge,
  Card,
  Avatar,
  Tooltip
} from "antd";
import UChat from "../UChatAPI";

const { Meta } = Card;
const socket = socketIOClient("http://localhost:3100");

class Notifications extends React.Component {
  state = {
    showNotifications: false,
    notificationData: [],
    showModal: false,
    selectedNotification: {}
  };

  handleVisibleChange = showNotifications => {
    this.setState({ showNotifications });
  };

  showModal = selected => {
    console.log(selected);
    this.setState({
      showModal: true,
      showNotifications: false,
      selectedNotification: selected
    });
  };

  handleCancel = () => {
    this.setState({
      showModal: false
    });
  };

  usersNotifications = () => {
    UChat.getNotifications()
      .then(res => {
        this.setState({
          notificationData: res.data.notifications
        });
      })
      .catch(err => console.log("Failed Retrieving User's Notifications"));
  };

  openUserProfileCard = () => {
    const { selectedNotification } = this.state;
    return (
      <Modal
        visible={this.state.showModal}
        onCancel={this.handleCancel}
        footer={null}
        style={{ margin: "-5% 0 0 35%" }}
        bodyStyle={{ height: "380px" }}
        width={"500px"}
      >
        <Card
          style={{ width: "510px", margin: "-5.5% 0 0 -5.5%" }}
          cover={
            <img
              alt="example"
              src={selectedNotification.sender_profile_pic}
              height="400px"
            />
          }
          actions={[
            <Tooltip title="Accept">
              <Icon type="like-o" onClick={() => this.addToContactList(selectedNotification)} />
            </Tooltip>,
            <Tooltip title="Ignore" >
              <Icon type="dislike-o" onClick={() => this.cancelRequest(selectedNotification)} />
            </Tooltip>
          ]}
        >
          <Meta
            title={selectedNotification.sender_username}
            description="This is the description"
          />
        </Card>
      </Modal>
    );
  };

  addToContactList = data => {
    const { currentUser } = this.props;

    UChat.addToContact({
      userID: currentUser.id,
      contactID: data.sender_id
    })
      .then(() => {
        socket.emit("notify", {
          action: "accepted-request",
          username: currentUser.username
        });
      })
      .catch(err => {
        console.log("Error Adding Contact To List", err);
      });

      UChat.addToContact({
        userID: data.sender_id,
        contactID: currentUser.id
      })
      .then(() => {

          this.setState({
            showModal: false
          }, () => this.cancelRequest(data))
      })
      .catch(err => {
        console.log("Error Adding Contact To List", err);
      });
  };

  cancelRequest = data => {
    const { currentUser } = this.props;
  
    UChat.deleteNotification({
      receiverID: currentUser.id,
      senderID: Number(data.sender_id)
    })
    .then(() => {
        this.setState({
            showModal: false
        }, () => this.usersNotifications())
    })
    .catch(err => console.log("Error Deleting Notification", err));
  };


  notificationContent = () => {
    const { notificationData } = this.state;

    if(notificationData.length){
        return notificationData.map(data => {
          return (
            <div
              className="notifications"
              id={data.sender_id}
              onClick={() => this.showModal(data)}
            >
              <div
                className="notification-profile-pic-container"
                id={data.sender_id}
                onClick={() => this.showModal(data)}
              >
                <img
                  className="contact-profile-pic "
                  id={data.sender_id}
                  src={data.sender_profile_pic}
                />
              </div>
              <div className="notification-info-container" id={data.sender_id}>
                <span className="notification-username" id={data.sender_id}>
                  {`You Have A New Friend Request from ${data.sender_username}`}
                </span>
              </div>
              <div
                id="notification-users-flag"
                className={`flag-background flag-${data.sender_country.toLowerCase()}`}
              />
            </div>
          );
        });
    }else{
        return <p>No Notifications</p>
    }
  };

  componentDidMount() {
    this.usersNotifications();
  }

  render() {
    const { showNotifications, notificationData } = this.state;
    return (
      <div>
        <Popover
          content={this.notificationContent()}
          trigger="click"
          visible={showNotifications}
          onVisibleChange={this.handleVisibleChange}
          overlayStyle={{ width: "380px", overflowY: "auto", height: "500px" }}
        >
          <Badge
            count={notificationData.length}
            overflowCount={99}
            style={{ fontSize: "8px" }}
          >
            <Icon type="inbox" style={{ fontSize: "180%" }} />
          </Badge>
        </Popover>
        {this.openUserProfileCard()}
      </div>
    );
  }
}

export default Notifications;
