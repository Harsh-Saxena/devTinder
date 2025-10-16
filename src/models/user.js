const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      index:true, // makes find query faster
      minLength: 3,
      maxLength: 50, 
    },
    lastName: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email :" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter Strong password :" + value);
        }
      },
    },
    age: {
      type: Number,
      required: false,
      min: 18,
    },
    gender: {
      type: String,
      required: false,
      trim: true,
      validate(value) {
        if (
          !["male", "female", "others", "Male", "Female", "Others"].includes(
            value
          )
        ) {
          throw new Error("Not a valid gender (Male , Female and other)");
        }
      },
    },
    about: {
      type: String,
      default: "Dev is in search for someone here",
    },
    photoURL: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL :" + value);
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ id: user._id }, "DEVTINDER@123");
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwrodHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwrodHash
  );

  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
