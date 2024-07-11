const express = require("express");
const userController = require("./userController");

const userRouter = express.Router();

userRouter.get("/", userController.check);

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

//login
userRouter.post("/login", userController.login);

//logout
userRouter.get("/logout", userController.logout);

//getNewToken
userRouter.post(
  "/refreshToken",
  userController.newLoginToken
);

module.exports = { userRouter };
