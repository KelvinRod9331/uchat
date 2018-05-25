let db = require("../db/queries");
var express = require("express");
var router = express.Router();
const { loginRequired } = require("../auth/helpers");

//Get Requests
router.get("/singleUser", loginRequired, db.getSingleUser);
router.get("/userByID/:id", loginRequired, db.getUserByID);
router.get("/allUsers", db.getAllUsers);
router.get("/logout", db.logoutUser);
router.get("/lang", db.getLanguages);
router.get("/countries", db.getAllCountries);
router.get("/contacts", loginRequired, db.getUsersContacts);
router.get("/logout", db.logoutUser);
router.get("/messages/:threadId", loginRequired, db.fetchAllMessages);
router.get("/threads", loginRequired, db.fetchedThreads);
router.get("/recentMsg", loginRequired, db.fetchRecentMessages);
router.get("/notifications", loginRequired, db.retrieveNotifications)

//Post Requests
router.post("/register", db.registerUser);
router.post("/login", db.loginUser);
router.post("/newThread", loginRequired, db.createThread);
router.post("/messages",  db.storeMessages);
router.post("/addContact", loginRequired, db.addToContacts);
router.post("/postNotification", db.postNotification)

//Patch Requests
router.patch("/updateUserInfo", loginRequired, db.updateUserInfo)
router.patch("/changeProfilePic", loginRequired, db.changeProfilePic);
router.patch("/updateUser", loginRequired, db.updateUserInfo);
router.patch("/notificationRead", loginRequired, db.notificationRead)

module.exports = router;
