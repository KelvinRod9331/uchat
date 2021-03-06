import React from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import "./Home.css"

class Home extends React.Component {
    state = { user: undefined }
    getUser = () => {
        axios
        .get('/singleUser')
        .then(res => {
            this.setState({
                user: res.data.data[0].username
            })
        }).catch(err => {
            this.setState({
                user: null
            })
        })
    }
    componentDidMount() {
        this.getUser();
    }
    render() {
        const { user } = this.state
        if (user) {
            return <Redirect to='/dashboard' />
        } else if (user === null) {
            return <Redirect to='/login' />
        }
        return null
    }
}

export default Home;
