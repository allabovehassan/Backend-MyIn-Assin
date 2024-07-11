require("dotenv").config();
const messages = require("../utils/messages.js");

function authorise(requiredAdminStatus) {
  return (req, res, next) => {
    const isAdmin = req.user.isAdmin;

    if (isAdmin === requiredAdminStatus) {
      next();
    } else {
      return res.status(401).send({
        success: false,
        message: messages.NOT_AUTHORIZED,
        data: null
      });
    }
  };
}

module.exports = { authorise };
