const validator = require("validator");

const validateSignupData = (req) => {

    const { firstName, lastName, emailID, password, age } = req.body;

    if(!firstName || !lastName) {
        throw new Error("Name fields cannot be empty");
    } else if (firstName.length < 2 || firstName.length > 30) {
        throw new Error("First name must be between 2 and 30 characters");
    }else if (lastName.length < 2 || lastName.length > 30) {
        throw new Error("Last name must be between 4 and 30 characters");
    }else if(!validator.isEmail(emailID)){
        throw new Error("Email is not valid");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough");
    }else if(age < 18 || age > 100){
        throw new Error("Age must be between 18 and 100");
    }   
};

module.exports = {validateSignupData};