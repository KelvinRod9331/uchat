var pgp = require("pg-promise")({});
var connectionString = "postgres://localhost/uchat";
var db = pgp(connectionString);

module.exports = db;

