const db = require("./index");
const authHelpers = require("../auth/helpers");
const passport = require("../auth/local");

function registerUser(req, res, next) {
    return authHelpers
      .createUser(req)
      .then(response => {
        passport.authenticate("local", (err, user, info) => {
          if (user) {
            res.status(200).json({
              status: "success",
              data: user,
              message: "Registered one user"
            });
          }
        })(req, res, next);
      })
      .catch(err => {
        res.status(500).json({
          status: "error",
          error: err
        });
      });
  }

  function loginUser(req, res, next) {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        res.status(500).send("error while trying to log in");
      } else if (!user) {
        res.status(401).send("invalid username/password");
      } else if (user) {
          console.log('after')
        req.logIn(user, function(err) {
          if (err) {
              console.log('error')
            res.status(500).send("error");
          } else {
              console.log('now')
            res.status(200).send(user);
          }
        });
      }
    })(req, res, next);
}

function logoutUser(req, res, next) {
  req.logout();
  res.status(200).send("log out success");
}

const uploadPhoto = (req, res, next) => {
    db
      .none('insert into photos (user_ID, url) values (${userID}, ${url})', req.body)
      .then(() => {
        res.send('Photo successfully uploaded.')
      })
      .catch(err => {
        res.status(500).send('Error uploading photo')
      })
  }

function getSingleUser(req, res, next) {
    db
      .any("select * from users where username=${username}", req.user)
      .then(function (data) {
        res.status(200).json({
          status: "success",
          data: data,
          message: "Retrieved single users"
        });
      })
      .catch(err => {
          res.status(500).json({
              status: 'unsuccessful',
              message: 'User Must Be Loged In',
              error: err
          })
      })
  }

  function getAllUsers(req, res, next) {
    db
      .any("select * from users")
      .then(function (data) {
        res.status(200).json({
          status: "success",
          data: data,
          message: "Retrieved single users"
        });
      })
      .catch(err => next(err))
  }


const updateUserInfo = (userInfo, callback) => {
    db.none('UPDATE users SET username=${username},fullname=${fullname},' +
    'zip_code= ${zipcode},email=${email} WHERE id=${id}', userInfo)
    .then(() => callback(null))
    .catch(err => callback(err))
  }

 const changeProfilePic = (req, res, next) => {
    db
      .none("UPDATE users SET profile_pic = ${newProfilePic} WHERE username = ${username}", {username: req.user.username, newProfilePic: req.body.newProfilePic})
      .then(function (data) {
        res.status(200).json({
          status: "success",
          data: data,
          message: "Removed profile_pic"
        })
        .catch(function(err) {
          return next(err);
        });
      })
  }

  module.exports = {
      registerUser,
      getSingleUser,
      loginUser,
      logoutUser,
      getAllUsers,
      updateUserInfo,
      changeProfilePic
  }