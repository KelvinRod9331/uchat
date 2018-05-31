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
  Avatar
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

  showModal = (selected) => {
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
      const {selectedNotification} = this.state 
    return (
      <Modal
        visible={this.state.showModal}
        onCancel={this.handleCancel}
        footer={null}
        style={{ margin: "-5% 0 0 30%" }}
        bodyStyle={{ height: "380px" }}
        width= {'300px'}
      >
        <Card
          style={{ width: "300px", margin: "-5% 0 0 -10%" }}
          cover={
            <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
          }
          actions={[
            <Icon type="setting" />,
            <Icon type="edit" />,
            <Icon type="ellipsis" />
          ]}
        >
          <Meta
            avatar={
              <Avatar src={selectedNotification.sender_profile_pic} />
            }
            title="Card title"
            description="This is the description"
          />
        </Card>
      </Modal>
    );
  };

  addToContactList = e => {
    const { currentUser } = this.props;
    const { results } = this.state;
    let id = e.target.id;
    let exists = results.find(contact => contact.contact_id === Number(id));
    console.log({ results: results, id: id, exists: exists });

    if (currentUser.id !== id && !Boolean(exists)) {
      axios
        .post("/addContact", {
          userID: currentUser.id,
          contactID: id
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

      axios
        .post("/addContact", {
          userID: id,
          contactID: currentUser.id
        })
        .catch(err => {
          console.log("Error Adding Contact To List", err);
        });
    }
  };

  notificationContent = () => {
    const { notificationData } = this.state;
    return notificationData.map(data => {
      return (
        <div
          className="notifications"
          id={data.sender_id}
          onClick={data => this.showModal(data)}
        >
          <div
            className="notification-profile-pic-container"
            id={data.sender_id}
            onClick={data => this.showModal(data)}
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
