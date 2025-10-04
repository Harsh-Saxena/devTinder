const mongoose = require('mongoose');
const connectDB = async() => {
    await mongoose.connect('mongodb+srv://hsaxena147_db_user:sgAM8RGK6DrpAAIT@practicenode.8xfvjdt.mongodb.net/devTinder')
}

module.exports = {connectDB};

