const bcrypt = require("bcryptjs");
const db = require("../db/index");

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

function createUser(req) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);
  return db.none(
    "INSERT INTO users (username, password_digest, email, full_name, language, country) VALUES (${username}, ${password}, ${email}, ${full_name}, ${language}, ${country})",
    { username: req.body.username, password: hash, email: req.body.email, full_name: req.body.fullname, language: req.body.language, country: req.body.country }
  );
}

function updateUserPassword(req){
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);
  return db.none(
    "UPDATE users SET password_digest=${password}",
    {password: hash}
  );
}

function loginRequired(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ status: "Please log in" });
  }
  return next();
}

module.exports = {
  comparePass,
  createUser,
  loginRequired,
  updateUserPassword
};
