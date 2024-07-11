const { connect } = require("mongoose");
require("dotenv").config();

const connection = connect(process.env.mongoURL);

module.exports = { connection };
