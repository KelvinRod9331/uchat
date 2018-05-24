import React, { Component } from "react";
import { Modal, Popover, Button, Icon, Badge  } from "antd";

class Inbox extends Component {
  content = () => {
    const { type, notifications } = this.props;

    return (
      <div>
        {notifications.map(data => {
          switch (type) {
            case "friend-request":
              return (
                <div>
                  <div className="friend-request-img">
                    <img src={data.profile_pic} />
                  </div>
                  <div className="friend-request-info">
                    {data.username} Sent You a Friend Request
                  </div>
                  <div className="friend-request-btns">
                    <Button>Accept</Button>
                    <Button>Ignore</Button>
                  </div>
                </div>
              );
          }
        })}
      </div>
    );
  };

  render() {
    const { type, notifications } = this.props;
    return (
    <Badge count={99} overflowCount={10}>
      <div>
        <Popover
          content={this.content()}
          trigger="click"
          visible={this.state.showMenu}
          onVisibleChange={this.handleVisibleChange}
          overlayStyle={{ height: 100 }}
        >
          <Icon type="inbox" style={{ fontSize: "170%" }} />
        </Popover>
      </div>
      </Badge>
    );
  }
}
