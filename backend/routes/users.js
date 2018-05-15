let db = require("../db/queries");
var express = require("express");
var router = express.Router();
const { loginRequired } = require("../auth/helpers");

//Get Requests
router.get("/singleUser",loginRequired, db.getSingleUser);
router.get("/allUsers", db.getAllUsers);
router.get("/logout", db.logoutUser)
router.get("/lang", db.getLanguages)
router.get("/countries", db.getAllCountries)
router.get("/contacts", loginRequired, db.getUsersContacts)
router.get("/logout", db.logoutUser)
router.get("/messages/:threadId", loginRequired, db.fetchAllMessages)
router.get("/threads", loginRequired, db.fetchedThreads)
router.get("/recentMsg", loginRequired, db.fetchRecentMessages)

//Post Requests
router.post("/register", db.registerUser);
router.post("/login", db.loginUser);
router.post("/newThread",loginRequired, db.createThread)
router.post("/messages", loginRequired, db.storeMessages)
router.post("/addContact", loginRequired, db.addToContacts)

router.patch("/changeProfilePic", loginRequired, db.changeProfilePic);
router.patch("/updateUser", loginRequired, db.updateUserInfo);


module.exports = router;