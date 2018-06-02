const db = require("./index");
const authHelpers = require("../auth/helpers");
const passport = require("../auth/local");
const uuidv4 = require('uuid/v4');

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
      console.log("after");
      req.logIn(user, function(err) {
        if (err) {
          console.log("error");
          res.status(500).send("error");
        } else {
          console.log("now");
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
    .none(
      "insert into photos (user_ID, url) values (${userID}, ${url})",
      req.body
    )
    .then(() => {
      res.send("Photo successfully uploaded.");
    })
    .catch(err => {
      res.status(500).send("Error uploading photo");
    });
};

function getSingleUser(req, res, next) {
  db
    .any("select * from users where id=${id}", req.user)
    .then(function(data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved single users"
      });
    })
    .catch(err => {
      res.status(500).json({
        status: "unsuccessful",
        message: "User Must Be Loged In",
        error: err
      });
    });
}

function getAllUsers(req, res, next) {
  db
    .any(
      "select id, username, email, full_name, language, profile_pic, country from users"
    )
    .then(function(data) {
      res.status(200).json({
        status: "success",
        allUsers: data,
        message: "Retrieved All Users"
      });
    })
    .catch(err => next(err));
}

const getUserByID = (req, res, next) => {
  db
    .any(
      "select id, username, email, full_name, language, country, profile_pic from users where id=${id}",
      req.params
    )
    .then(function(data) {
      res.status(200).json({
        status: "success",
        user: data,
        message: "Retrieved single users"
      });
    })
    .catch(err => {
      res.status(500).json({
        status: "unsuccessful",
        message: "User Must Be Loged In",
        error: err
      });
    });
};

const updateUserInfo = (req, res, next) => {
  switch (req.body.type) {
    case "user-info":
      return db
        .one(
          "UPDATE users SET username=${username},full_name=${full_name}," +
            "email=${email}, about=${about} WHERE id=${id} RETURNING users.*",
          req.body
        )
        .then(user => {
          if (user) {
            req.logIn(user, function(err) {
              if (err) {
                console.log("error");
                res.status(500).send("error");
              } else {
                console.log("now");
                res.status(200).send(req.user);
              }
            });
          }
        })
        .catch(function(err) {
          return next(err);
        });

    case "user-password":
      return authHelpers
        .updateUserPassword(req)
        .then(response => {
          passport.authenticate("local", (err, user, info) => {
            if (user) {
              req.logIn(user, function(err) {
                if (err) {
                  console.log("error");
                  res.status(500).send("error");
                } else {
                  console.log("now");
                  res.status(200).send(req.user);
                }
              });
            }
          })(req, res, next);
        })
        .catch(err => {
          res.status(500).json({
            status: "error updating password",
            error: err
          });
        });
  }
};

const changeProfilePic = (req, res, next) => {
  db
    .none("UPDATE users SET profile_pic = ${newProfilePic} WHERE id = ${id}", {
      id: req.user.id,
      newProfilePic: req.body.url
    })
    .then(function(data) {
      res
        .status(200)
        .json({
          status: "success",
          data: data,
          message: "Removed profile_pic"
        })
        .catch(function(err) {
          return next(err);
        });
    });
};

const deleteProfilePic = (req, res, next) => {
  var defaultImg =
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";

  db
    .none("UPDATE users SET profile_pic = ${default} WHERE id = ${id}", {
      default: defaultImg,
      id: req.user.id
    })
    .then(function(data) {
      res
        .status(200)
        .json({
          status: "success",
          data: data,
          message: "Removed profile_pic"
        })
        .catch(function(err) {
          console.log("Error Deleting Photo", err);
          return next(err);
        });
    });
};

const getLanguages = (req, res, next) => {
  db
    .any("select * from languages")
    .then(data => {
      res.status(200).json({
        status: "Successful",
        languages: data,
        message: "Fetched All Langauges"
      });
    })
    .catch(function(err) {
      return next(err);
    });
};

const getAllCountries = (req, res, next) => {
  db
    .any("select * from countries")
    .then(data => {
      res.status(200).json({
        status: "Successful",
        countries: data,
        message: "Fetched All Countries"
      });
    })
    .catch(function(err) {
      return next(err);
    });
};

const getUsersContacts = (req, res, next) => {
  db
    .any(
      "SELECT contact_id, username, language, profile_pic, full_name, country, about FROM contacts JOIN users ON contact_id = users.id WHERE user_id=${id}",
      req.user
    )
    .then(data => {
      res.status(200).json({
        status: "Successful",
        contacts: data,
        message: "Fetched User's Contacts"
      });
    })
    .catch(function(err) {
      return next(err);
    });
};

const createThread = (req, res, next) => {

  db
    .one(
      "INSERT INTO threads (id, user_one, user_two, user_one_name, user_two_name, created) VALUES (${id}, ${user_id}, ${contact_id}, ${user_one_name}, ${user_two_name}, ${created}) RETURNING id, user_one, user_two, user_one_name, user_two_name, created",
      req.body
    )
    .then(data => {
      res.status(200).json({
        status: "Success",
        thread: data,
        message: "Created A New Thread"
      });
    })
    .catch(function(err) {
      console.log("Error Inserting Into threads", err);
      return next(err);
    });
};

const fetchedThreads = (req, res, next) => {
  db
    .any(
      "SELECT threads.id, user_one, user_two, user_one_name, user_two_name, created, full_name, language, profile_pic FROM threads JOIN users ON users.id = user_two WHERE  user_one=${id}",
      req.user
    )
    .then(data => {
      res.status(200).json({
        status: "Success",
        threads: data,
        message: "All User's Threads Fetch"
      });
    })
    .catch(function(err) {
      return next(err);
    });
};

const storeMessages = (req, res, next) => {
  db
    .none(
      "INSERT INTO messages (thread_id, sender_id, receiver_id, sender_message, receiver_message, date_sent, isread) VALUES (${thread_id}, ${sender_id}, $(receiver_id), ${sender_message}, ${receiver_message}, ${date_sent}, ${isread})",
      req.body
    )
    .then(() => {
      res.status(200).json({
        status: "Success"
      });
    })
    .catch(function(err) {
      console.log("Error Storing", err);
      return next(err);
    });
};

const fetchAllMessages = (req, res, next) => {
  db
    .any(
      "SELECT sender_message, receiver_message, sender_id, receiver_id, date_sent FROM messages JOIN threads ON threads.id = thread_id WHERE thread_id = ${threadId}",
      req.params
    )
    .then(data => {
      res.status(200).json({
        messages: data
      });
    })
    .catch(function(err) {
      return next(err);
    });
};

const messageRead = (req, res, next) => {
  db
    .none("UPDATE messages SET isread={true} WHERE id={id}")
    .then(() => {
      res.status(200).json({
        status: "User Read Message"
      });
    })
    .catch(function(err) {
      console.log("Error Updating Message", err);
      return next(err);
    });
};

const fetchRecentMessages = (req, res, next) => {
  db
    .any(
      "SELECT DISTINCT ON (thread_id) * FROM messages WHERE sender_id = ${id} OR receiver_id = ${id} ORDER BY thread_id, id DESC",
      req.user
    )
    .then(data => {
      res.status(200).json({
        recentMsg: data
      });
    })
    .catch(function(err) {
      return next(err);
      console.log("Error On Getting Recent Message", err);
    });
};

const addToContacts = (req, res, next) => {
  db
    .none(
      "INSERT INTO contacts (user_ID, contact_ID) VALUES (${userID}, ${contactID})",
      req.body
    )
    .then(() => {
      res.status(200).json({
        status: "Successful On Adding a Contact to Users Contact list"
      });
    })
    .catch(function(err) {
      console.log("Error Adding To Contacts", err);
      return next(err);
    });
};

const postNotification = (req, res, next) => {
  db
    .none(
      "INSERT INTO notifications (receiver_id, sender_id, sender_username, sender_profile_pic, sender_country, type, date_sent, opened) VALUES (${receiver_id}, ${sender_id}, ${sender_username}, ${sender_profile_pic }, ${sender_country}, ${type}, ${date_sent}, ${opened})",
      req.body
    )
    .then(() => {
      res.status(200).json({
        status: "Successful On Posting To Notification"
      });
    })
    .catch(function(err) {
      console.log("Error Posting To Notification", err);
      return next(err);
    });
};

const retrieveNotifications = (req, res, next) => {
  db
    .any("SELECT * FROM notifications WHERE receiver_id = ${id}", req.user)
    .then(data => {
      res.status(200).json({
        status: "Successful On Retrieving Users' Notification",
        notifications: data
      });
    })
    .catch(function(err) {
      console.log("Error Retrieving User's Notification", err);
      return next(err);
    });
};

const notificationRead = (req, res, next) => {
  db
    .none("UPDATE notifications SET read={true} WHERE id={id}", req.body)
    .then(() => {
      res.status(200).json({
        status: "User Read Notification"
      });
    })
    .catch(function(err) {
      console.log("Error Updating User Notifications", err);
      return next(err);
    });
};

const deleteNotification = (req, res, next) => {
  db
  .none("DELETE FROM notifications WHERE receiver_id = ${receiverID} AND sender_id = ${senderID}", req.body)
  .then(() => {
    res.status(200).json({
      status: "Notification Successfully Deleted"
    });
  })
  .catch(function(err) {
    console.log("Error Deleting Notifications", err);
    return next(err);
  });
}

module.exports = {
  registerUser,
  getSingleUser,
  getUserByID,
  loginUser,
  logoutUser,
  getAllUsers,
  updateUserInfo,
  deleteProfilePic,
  changeProfilePic,
  getLanguages,
  getAllCountries,
  addToContacts,
  getUsersContacts,
  createThread,
  storeMessages,
  fetchAllMessages,
  messageRead,
  fetchRecentMessages,
  fetchedThreads,
  postNotification,
  retrieveNotifications,
  notificationRead,
  deleteNotification
};
