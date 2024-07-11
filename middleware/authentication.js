const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const messages = require("../utils/messages");
require("dotenv").config();

function authenticator(req, res, next) {
  try {
    let token = req.cookies.Token;

    const blacklistFilePath = path.resolve(
      __dirname,
      "../blacklist.json"
    );

    // Check if the blacklist file exists
    if (!fs.existsSync(blacklistFilePath)) {
      fs.writeFileSync(
        blacklistFilePath,
        JSON.stringify([]),
        "utf-8"
      );
    }

    let data = JSON.parse(
      fs.readFileSync(blacklistFilePath, "utf-8")
    );

    if (data.includes(token)) {
      return res.status(401).send({
        success: false,
        message: messages.LOGIN_AGAIN,
        data: null
      });
    }

    jwt.verify(
      token,
      process.env.key,
      (err, decoded) => {
        if (err) {
          return res.status(401).send({
            success: false,
            message: messages.LOGIN_AGAIN,
            data: null
          });
        }
        req.user = req.user || {};
        req.user.isAdmin = decoded.isAdmin;
        req.user.id = decoded.userId;
        next();
      }
    );
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: messages.SERVER_ERROR,
      data: JSON.stringify(error)
    });
  }
}

module.exports = { authenticator };
