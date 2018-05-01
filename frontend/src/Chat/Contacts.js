import React, {Component} from 'react'
import axios from 'axios'



export default class Contacts extends Component{
    constructor(){
        super()
        this.state = {
        contactList: []

        }
    }

    createChatRoom = (e) => {
        return 
    }


componentDidMount(){
    axios
    .get('/contacts')
    .then(res => {
        this.setState({
            contactList: res.data.contacts
        })
    })
    .catch(err => console.log("Couldn't Fetch User's Contacts:", err))
}

    render(){
        const {contactList} = this.state
        return (
            <div className="contactlist-container">
                {
                    contactList.map(c => (
                        <div 
                        className='contacts-container'
                        id={c.contact_id}
                        >
                            <span>
                                <img src={c.profile_pic} width='80px'/>
                            </span> {' '}
                            <span>
                             Username:   {c.username}
                            </span>{' '}
                            <span>
                             Language:   {c.language}
                            </span> {' '}
                        </div>
                    ))
                }
            </div>
        )
    }
}