const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");


//get profile of logged in user
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user; //getting user from req object which is set in userAuth middleware
    res.send(user);
  } catch (err) {
    res.status(401).send("ERROR: ", err.message);
  }
});

//edit profile of logged in user
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if(!validateEditProfileData(req)) {
      throw new Error('Invalid Edit Request');
    }
    const loggedInUser = req.user;

    console.log(loggedInUser,'before updare');
    //loggedInUser.firstName = req.user.firstName;

    Object.keys(req.body).forEach((key)=> loggedInUser[key] = req.body[key]);

    console.log(loggedInUser,"after update");

    await loggedInUser.save();
    res.send('Profile updated successfully');

    res.send(user);
  } catch (err) {
    res.status(400).send("ERRR: ", err.message);
  }
});

module.exports = {profileRouter};
