let db = require("../db/queries");
var express = require("express");
var router = express.Router();
const { loginRequired } = require("../auth/helpers");

router.get("/singleUser", db.getSingleUser);
router.get("/allUsers", db.getAllUsers);
router.get("/logout", db.logoutUser)

router.post("/register", db.registerUser);
router.post("/login", db.loginUser);

router.patch("/changeProfilePic", loginRequired, db.changeProfilePic);
router.patch("/updateUser", loginRequired, db.updateUserInfo);


module.exports = router;