const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlerware.js");


const userController = require("../controllers/user.js");

//===============================================================================
// for signUp
//===============================================================================
//form show
router.get("/signup", userController.renderSignupForm);

// for data upload in data
router.post("/signup", wrapAsync(userController.signup));

//=============================================================


//===============================================================================
// for LogIn
//===============================================================================

//form show
router.get("/login", userController.renderLoginForm);

// submit form 

//passport.authenticate() // is middleware 


router.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), userController.login);

router.get("/logout", userController.logout);

//================================================================
module.exports = router;