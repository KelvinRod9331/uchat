openChatRoom = e => {
    const { usersThreads } = this.state;
  
    if (typeof e === "object" && e.created) {
      let thread = e;
      this.setState({ threadSelected: thread }, () => this.getUserByID(thread));
    } else if (typeof e === "object") {
      let thread = usersThreads.find(thread => thread.id === Number(e.target.id));
      this.setState({ threadSelected: thread }, () => this.getUserByID(thread));
    }
  };