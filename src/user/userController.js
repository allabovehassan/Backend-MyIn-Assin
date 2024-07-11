const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("./userModel.js");
const messages = require("../../utils/messages.js");
const {
  validateSignup,
  validateLogin
} = require("./userValidation.js");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

async function check(req, res) {
  res.send(messages.VALIDATION_ERROR);
}

// sign up user
async function signup(req, res) {
  try {
    const { value, error } = validateSignup(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: messages.VALIDATION_ERROR,
        data: error
      });
    }

    const checkUser = await User.findOne({
      username: new RegExp(
        "^" + value.username + "$",
        "i"
      )
    });
    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: messages.DUPLICATE_USERNAME,
        data: null
      });
    }

    const checkEmail = await User.findOne({
      email: new RegExp("^" + value.email + "$", "i")
    });
    if (checkEmail) {
      return res.status(400).json({
        success: false,
        message: messages.DUPLICATE_ENTRY_EMAILID,
        data: null
      });
    }

    const hash = await bcrypt.hash(
      value.password,
      +process.env.saltround
    );

    let data = new User({
      username: value.username,
      email: value.email,
      phone: value.phone,
      password: hash,
      name: value.name,
      address: value.address
    });

    if (data && data.username) {
      await data.save();
      return res.status(200).send({
        success: true,
        message: messages.SUCCESSFULLY_REGISTER,
        data: data.username
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: messages.SERVER_ERROR,
      data: JSON.stringify(error)
    });
  }
}

//login user
async function login(req, res) {
  try {
    const { value, error } = validateLogin(req.body);
    if (error) {
      return res.status(400).send({
        success: false,
        message: messages.VALIDATION_ERROR,
        data: error
      });
    }

    const userFind = await User.findOne({
      username: value.username
    });

    if (userFind) {
      const isMatch = await bcrypt.compare(
        value.password,
        userFind.password
      );

      if (isMatch) {
        const token = jwt.sign(
          {
            userId: userFind._id,
            isAdmin: userFind.isAdmin
          },
          process.env.KEY,
          { expiresIn: "3h" }
        );
        const refreshToken = jwt.sign(
          {
            userId: userFind._id,
            isAdmin: userFind.isAdmin
          },
          process.env.REFRESH_KEY,
          { expiresIn: "5h" }
        );

        res.cookie("Token", token, {
          httpOnly: true
        });
        res.cookie("Refresh_Token", refreshToken, {
          httpOnly: true
        });

        return res.status(200).send({
          success: true,
          message: messages.LOGIN_SUCCESSFULLY,
          data: {
            token,
            refreshToken
          }
        });
      } else {
        return res.status(403).send({
          success: false,
          message: messages.INVALID_CREDENTIALS,
          data: null
        });
      }
    } else {
      return res.status(403).send({
        success: false,
        message: messages.UNAUTHORIZED,
        data: null
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: messages.SERVER_ERROR,
      data: JSON.stringify(error)
    });
  }
}

//logout
async function logout(req, res) {
  try {
    const token = req.cookies.Token;
    if (!token) {
      return res.status(400).send({
        success: false,
        message: messages.NO_TOKEN_PROVIDED,
        data: null
      });
    }

    const blacklistFilePath = path.resolve(
      __dirname,
      "../../blacklist.json"
    );

    // Check if the blacklist file exists, and create it if it doesn't
    if (!fs.existsSync(blacklistFilePath)) {
      fs.writeFileSync(
        blacklistFilePath,
        JSON.stringify([]),
        "utf-8"
      );
    }

    // Read the existing blacklist file
    let userTokenFile = JSON.parse(
      fs.readFileSync(blacklistFilePath, "utf-8")
    );

    // Add the token to the blacklist
    userTokenFile.push(token);

    // Write the updated blacklist back to the file
    fs.writeFileSync(
      blacklistFilePath,
      JSON.stringify(userTokenFile),
      "utf-8"
    );

    // Clear the cookie
    res.clearCookie("Token");
    res.clearCookie("Refresh_Token");

    return res.status(200).send({
      success: true,
      message: messages.LOGOUT_SUCCESSFULLY,
      data: null
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: messages.SERVER_ERROR,
      data: JSON.stringify(error)
    });
  }
}

async function newLoginToken(req, res) {
  try {
    const refreshToken = req.cookies.Refresh_Token;

    if (!refreshToken) {
      return res.status(401).send({
        success: false,
        message: messages.LOGIN_AGAIN,
        data: null
      });
    }

    jwt.verify(
      refreshToken,
      process.env.refresh_key,
      (err, decoded) => {
        if (err) {
          return res.status(401).send({
            success: false,
            message: messages.LOGIN_AGAIN,
            data: null
          });
        }

        const token = jwt.sign(
          { a: "b" },
          process.env.key,
          { expiresIn: "3h" }
        );

        return res.status(200).send({
          success: true,
          message: messages.LOGIN_SUCCESSFULLY,
          data: {
            token
          }
        });
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

module.exports = {
  check,
  signup,
  login,
  logout,
  newLoginToken
};
