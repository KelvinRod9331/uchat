import React, { Component } from 'react';
import { 
  Route, 
  // eslint-disable-next-line 
  Link, 
  Switch} from 'react-router-dom'
import './App.css';
import ChatRoom from './Chat/ChatRoom'
import Login from './Home/Login'
import Home from './Home/Home'
import Register from "./Register/Register"

class App extends Component {
  render() {
    return (
      <div className="App">
      <Switch>
        <Route exact path = '/home' component={Home}/>
        <Route exact path = '/register' component={Register}/>
        <Route exact path = '/login' component={Login}/>
        <Route exact path = '/chat' component={ChatRoom}/>
      </Switch>
      </div>
    );
  }
}

export default App;
