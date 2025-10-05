const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  //read the token from req cookie
  //validate the token
  //Find the user
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Token is not Valid");
    }
    //Validate my token
    const decodedObj = await jwt.verify(token, "DEVTINDER@123");
    const { id } = decodedObj;
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user; //storing user in req object
    next(); //call the next function to move to next middleware or route handler
  } catch (err) {
    res.status(401).send("ERR0RR: ", err.message);
  }
};
module.exports = { userAuth };
