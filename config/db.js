const { connect } = require("mongoose");

const connection = connect(process.env.mongoURL);

module.exports = { connection };