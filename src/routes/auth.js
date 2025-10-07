const express = require("express");
const User = require("../models/user");
const { validateSignupData } = require("../utils/validation");
const authRouter = express.Router();
const bcrypt = require("bcrypt");


//Post data to create user
authRouter.post("/signup", async (req, res) => {
  try {
    //Data validation
    validateSignupData(req);

    //password encryption
    const { password, emailId } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;

    const checkEmail = await User.findOne({ emailId });
    console.log(checkEmail);
    if (checkEmail) {
      throw new Error("Email Already Exist");
    }

    console.log(req.body);
    //Creating instance of user model
    const user = new User(req.body);
    await user.save();
    res.send("User added succsessfully");
  } catch (err) {
    console.log("Error in creating user", err.message);
    res.status(400).send(err.message);
  }
});

//Login API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Email not found");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      //Create a JWT Token
      const token = await user.getJWT();
      //setting cookie in the browser
      res.cookie("token", token);
      res.send("Login successful");
    } else {
      throw new Error("Password is incorrect");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//Logout API
authRouter.post("/logout", async (req, res) => {
    try { 
        res.clearCookie("token");
        res.send("Logout Successful");
    }catch(err) {
        res.status(400).send("ERROR: ", err.message);
    }


});
module.exports = { authRouter };