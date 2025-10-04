const express = require("express");
const User = require("./models/user");

const app = express();
const { connectDB } = require("./config/database");

app.use(express.json()); // Middleware to parse JSON request bodies for all apis

//Post data to create user
app.post("/signup", async (req, res) => {
  //Creating instance of user model
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added succsessfully");
  } catch (err) {
    console.log("Error in creating user", err.message);
    res.status(400).send(err.message);
  }
});
//Find user by emailID
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailID;
  try {
    const user = await User.find({ emailID: userEmail });
    if (user.length === 0) {
      return res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    console.log("Error in creating user", err);
  }
});
//Get all user from database
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find();
    res.send(user);
  } catch (err) {
    console.log("Error in creating user", err);
  }
});

//delete user api
app.delete("/deleteUser", async (req, res) => {
  const userID = req.body.userID;
  try {
    const deleteUser = await User.findByIdAndDelete(userID);
    res.send("User deleted successfully");
  } catch (err) {
    console.log("Error in deleting user", err);
  }
});

//Update the User
app.patch("/updateUser", async (req, res) => {
    const userID = req.body.userID;
    const data = req.body;

    const ALLOWED_UPDATES = ['firstName','lastName','password'];

    try{
    const isUpdateAllowed = Object.keys(data).every((key) => {
        ALLOWED_UPDATES.includes(key);
    });

    if(!isUpdateAllowed){
        return res.status(400).send("Update is not allowed");
    }
        const updateUser = await User.findByIdAndUpdate(userID, data);
        res.send("User updated successfully");  
    }catch(err){
        console.log("Error in updating user", err);
    }
});

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
