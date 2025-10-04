const express = require("express");
const User = require("./models/user");
const app = express();
const { connectDB } = require("./config/database");


app.use(express.json()); // Middleware to parse JSON request bodies for all apis

app.post("/signup", async (req, res) => {
  //Creating instance of user model
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added succsessfully");
  } catch (err) {
    console.log("Error in creating user", err);
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
