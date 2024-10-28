const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Login")
    .then(() => {
        console.log("DataBase Connected Successfully for Mongoose Side");
    })
    .catch((err) => {
        console.log(err);
    });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    }
});

const User = mongoose.model("User", userSchema);

const loginSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const Ls = mongoose.model("Ls", loginSchema);

module.exports = { User, Ls };
