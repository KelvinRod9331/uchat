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
    .any("select * from users where username=${username}", req.user)
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
    .any("select id, username, email, full_name, language, profile_pic, country from users")
    .then(function(data) {
      res.status(200).json({
        status: "success",
        allUsers: data,
        message: "Retrieved All Users"
      });
    })
    .catch(err => next(err));
}

const updateUserInfo = (userInfo, callback) => {
  db
    .none(
      "UPDATE users SET username=${username},fullname=${fullname}," +
        "zip_code= ${zipcode},email=${email} WHERE id=${id}",
      userInfo
    )
    .then(() => callback(null))
    .catch(err => callback(err));
};

const changeProfilePic = (req, res, next) => {
  db
    .none(
      "UPDATE users SET profile_pic = ${newProfilePic} WHERE username = ${username}",
      { username: req.user.username, newProfilePic: req.body.newProfilePic }
    )
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
      "SELECT contact_id, username, language, profile_pic, full_name, country FROM contacts JOIN users ON contact_id = users.id WHERE user_id=${id}",
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
      "INSERT INTO threads (user_one, user_two) VALUES (${user_id}, ${contact_id}) RETURNING ID",
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
      return next(err);
    });
};

const fetchedThreads = (req, res, next) => {
db
.any('SELECT threads.id, user_one, user_two, username,full_name, language, profile_pic FROM threads JOIN users ON users.id = user_two WHERE  user_one=${id} or user_two=${id}', req.user)
.then(data => {
  res.status(200).json({
    status: "Success",
    threads: data,
    message: "All User's Threads Fetch"
  })
})
  .catch(function(err) {
    return next(err);
  });

}

const storeMessages = (req, res, next) => {
  db.none(
    "INSERT INTO messages (thread_id, sender_id, receiver_id, sender_message, receiver_message, date_sent, isread) VALUES (${thread_id}, ${sender_id}, $(receiver_id), ${sender_message}, ${receiver_message}, ${date_sent}, ${isread})",
    req.body
  ).then(() => {
    res.status(200).json({
      status: 'Success'
    })
  })
  .catch(function(err) {
    console.log("Error Storing", err)
    return next(err);
  });
};

const fetchAllMessages = (req, res, next) => {
  db
  .any('SELECT sender_message, receiver_message, sender_id, receiver_id FROM messages JOIN threads ON threads.id = thread_id WHERE thread_id = ${threadId}', req.params)
  .then(data => {
    res.status(200).json({
      messages: data
    })
  })
  .catch(function(err) {
    return next(err);
  });
};

const fetchRecentMessages = (req, res, next) => {

db
.any('SELECT * FROM messages WHERE sender_id = ${user.id} OR receiver_id = ${user.id}', req)
.then(data => {
  res.status(200).json({
    recentMsg: data
  })
})
.catch(function(err) {
  return next(err);
  console.log('Error On Getting Recent Message', err)
});
}

const addToContacts = (req, res, next) => {
db
.none('INSERT INTO contacts (user_ID, contact_ID) VALUES (${userID}, ${contactID})', req.body)
.then(() => {
  res.status(200).json({
    status: 'Successful On Adding a Contact to Users Contact list'
  })
})
.catch(function(err) {
  console.log("Error Adding To Contacts", err)
  return next(err);
});
};

module.exports = {
  registerUser,
  getSingleUser,
  loginUser,
  logoutUser,
  getAllUsers,
  updateUserInfo,
  changeProfilePic,
  getLanguages,
  getAllCountries,
  addToContacts,
  getUsersContacts,
  createThread,
  storeMessages,
  fetchAllMessages,
  fetchRecentMessages,
  fetchedThreads
};
