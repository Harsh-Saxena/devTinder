const express = require("express");
const User = require("./models/user");
const app = express();
const { connectDB } = require("./config/database");

connectDB()
  .then(() => {
    console.log("DB connection established");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("DB connection error");
  });

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Harsh",
    lastName: "Saxena",
    emailID: "hsaxena@gmail.com",
    password: "harsh123",
    age: 29,
    gender: "Male",
  };
  //Creating instance of user model
  const user = new User(userObj);

  try {
    await user.save();
    res.send("User added succsessfully");
  } catch (err) {
    console.log("Error in creating user", err);
  }
});
