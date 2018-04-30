import React, { Component } from "react";
import { Grid, Row } from "react-bootstrap";
import "./index.css";
import ChatRoom from './ChatRoom'


class Dashboard extends Component {
    constructor(){
        super()
        this.state = {
            selected: 'chats'
        }
    }
  handleSelection = e => {this.setState({selected:e.target.id })};

  displayWindow = () => {
    const { selected } = this.state;

    switch(selected){
        case 'chats':
        return <ChatRoom />;
        default:
        return ""
    }

  }

  render() {
    const { handleSelection, displayWindow } = this;
  
    return (
      <Grid bsClass="dashboard-container">
        <Row bsClass="component-container">
          <div className="component-box" id="chats" onClick={handleSelection}>
           <p id='chats'>Chats</p> 
          </div>
          <div
            className="component-box"
            id="contacts"
            onClick={handleSelection}
          >
           <p id='contacts'>Contacts</p>  
          </div>
          <div className="component-box" id="status" onClick={handleSelection}>
          <p id='status'>Status </p>  
          </div>
        </Row>
        <Row bsClass="display-container">
          <div
            className="display-box"
          >
            {displayWindow()}
          </div>
        </Row>
      </Grid>
    );
  }
}

export default Dashboard;
