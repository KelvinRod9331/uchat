import React, { Component } from "react";
import Search from "./Search";
import { Grid, Row, Col } from "react-bootstrap";

export default class Discovery extends Component {
  render() {
    const {
      allUsers,
      search,
      currentUser
    } = this.props;
    return (
      <Grid>
        <Search
          currentUser={currentUser}
          search={search}
          allUsers={allUsers}
        />
        <div>
          <h1>Search For Anyone Across The World</h1>
        </div>
      </Grid>
    );
  }
}
