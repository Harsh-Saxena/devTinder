const express = require("express");
const User = require("./models/user");

const app = express();
const { connectDB } = require("./config/database");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json()); // Middleware to parse JSON request bodies for all apis
app.use(cookieParser()); // Middleware to parse cookies

const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/request"); 



app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter); 

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
