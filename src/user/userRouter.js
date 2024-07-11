const express = require("express");
const userController = require("./userController");

const userRouter = express.Router();

/**
 * @api {post} /signup
 * @apiName signup
 * @apiDescription New user can Register
 * @apiPermission User
 * @apiParam { String } email Need to pass EmailId (Required, Unique)
 * @apiParam { String } username Need to pass (Required)
 * @apiParam { String } adress Need to pass (optional)
 * @apiParam { String } password Need to pass (Required)
 * @apiParam { Object } phoneNo  (optional)
 * @apiParam { String } name Need to Pass  (Required)
 * @apiSuccess { Object} user Details of registered user
 */

userRouter.post("/signup", userController.signup);

/**
 * @api {post} /login
 * @apiName login
 * @apiDescription New user can Login
 * @apiPermission User
 * @apiParam { String } username Need to pass (Required)
 * @apiParam { String } password Need to pass (Required)
 * @apiSuccess { Object} user Login and Token
 */

userRouter.post("/login", userController.login);

/**
 * @api {get} /logout
 * @apiName logout
 * @apiDescription user can Logout
 * @apiPermission User
 * @apiSuccess { Object} user Logout
 */

userRouter.get("/logout", userController.logout);

/**
 * @api {post} /refreshToken
 * @apiName refreshToken
 * @apiDescription user can get refresh token
 * @apiPermission User
 * @apiSuccess { Object} user refresh token
 */
//getNewToken
userRouter.post(
  "/refreshToken",
  userController.newLoginToken
);

module.exports = { userRouter };
