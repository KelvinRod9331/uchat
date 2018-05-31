/* eslint-disable */
import React from "react";
import axios from "axios";

// const userLoggedIn = () => {
//   axios
//     .get("/singleUser")
//     .then(res => {
//       this.setState({
//         currentUser: res.data.data[0]
//       });
//       socket.emit("storeClientInfo", {
//         userId: res.data.data[0].id,
//         username: res.data.data[0].username,
//         language: res.data.data[0].language
//       });
//       loggedIn = true;
//     })
//     .catch(err => {
//       loggedIn = false;
//     });
// };

// const fetchUsers = () => {
//   axios
//     .get("/allUsers")
//     .then(res => {
//       this.setState({
//         allUsers: res.data.allUsers
//       });
//     })
//     .catch(err => console.log("Error", err));
// };

// const fetchUserThreads = () => {
//   axios
//     .get("/threads")
//     .then(res => {
//       this.setState({
//         threads: res.data.threads
//       });
//     })
//     .catch(err => console.log("Error:", err));
// };

// const fetchRecentMessage = () => {
//   axios
//     .get("/recentMsg")
//     .then(res => {
//       this.setState({
//         recentMsg: res.data.recentMsg
//       });
//     })
//     .catch(err => console.log("Error Getting Recent Message", err));
// };

// const openChatRoom = e => {
//     const { usersThreads } = this.props;
//     let threadSelected = usersThreads.find(thread => {
//       if (thread.id === Number(e.target.id)) {
//         return thread;
//       }
//     });

//     this.setState(
//       {
//         threadSelected: threadSelected
//       },
//       () => this.getUserByID(threadSelected)
//     );
//   };

//  const  getUserByID = (thread) => {
//     const { currentUser } = this.props;

//     if (thread.user_one === currentUser.id) {
//       axios
//         .get(`/userByID/${thread.user_two}`)
//         .then(res => {
//           this.setState(
//             {
//               contactUser: res.data.user[0]
//             },
//             () => this.fetchConversation(thread.id)
//           );
//         })
//         .catch(err => console.log(err));
//     } else {
//       axios
//         .get(`/userByID/${thread.user_one}`)
//         .then(res => {
//           this.setState(
//             {
//               contactUser: res.data.user[0]
//             },
//             () => this.fetchConversation(thread.id)
//           );
//         })
//         .catch(err => console.log(err));
//     }
//   };

//   const fetchConversation = id => {
//     axios
//       .get(`/messages/${id}`)
//       .then(res => {
//         this.setState({
//           threadMessages: res.data.messages
//         });
//       })
//       .catch(err => console.log("err", err));
//   };

const randomImageGenerator = () => axios.get("https://source.unsplash.com/random");
const randomQuotesGenerator = () => axios.get("https://talaikis.com/api/quotes/random/");
const logOut = () => axios.get("/logout");
const updateUserInfo = userInfo => axios.patch("/updateUserInfo", userInfo);
const uploadImgUrl = url => axios.patch("/changeProfilePic", url);
const postNotifications = data => axios.post("/postNotification", data);
const getNotifications = () => axios.get("notifications");
const deleteNotification = data => axios.delete("/deleteNotification", { data: data });
const addToContact = data => axios.post("/addContact", data);

export default {
  randomImageGenerator,
  randomQuotesGenerator,
  logOut,
  updateUserInfo,
  uploadImgUrl,
  postNotifications,
  getNotifications,
  deleteNotification,
  addToContact
};
