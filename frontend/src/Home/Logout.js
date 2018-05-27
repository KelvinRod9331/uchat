import React, {Component} from 'react'
import Logout from '../UChatAPI'
import {Redirect} from 'react-router'

export default class Logoff extends Component{



    render(){
        Logout.logOut()
        return <Redirect to='/'/>
    }
}