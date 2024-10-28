const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const methodOverride = require('method-override');
const { User, Ls } = require("./db.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Home Route
app.get("/", (req, res) => {
    res.render("login.ejs");
});

// Signup Route
app.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

app.post("/signup", async (req, res) => {
    try {
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const data = {
            userName: req.body.userName,
            password: hashedPassword 
        };

        await Ls.create(data);
        res.redirect("/");
    } catch (error) {
        console.error("Error during signup: ", error);
        res.status(500).send("Internal server error during signup");
    }
});

// Login Route
app.post("/login", async (req, res) => {
    try {
        let user = await Ls.findOne({ userName: req.body.userName });

        if (!user) {
            return res.status(400).send("Invalid username");
        }
        
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

        if (isPasswordMatch) {
            return res.redirect("/data");
        } else {
            return res.status(400).send("Invalid password");
        }
    } catch (error) {
        console.error("Error during login: ", error);
        return res.status(500).send("Internal server error");
    }
});

// Route to Enter New User Details
app.get("/data/new", (req, res) => {
    res.render("index.ejs"); 
});

app.post("/data/new", async (req, res) => {
    try {
        const details = {
            name: req.body.name,
            email: req.body.email,
            number: req.body.number
        };

        const newUser = new User(details);
        await newUser.save();
        res.redirect("/data");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving user details.");
    }
});

// View All Users
app.get("/data", async (req, res) => {
    try {
        const users = await User.find(); // Get all users
        res.render("data.ejs", { users }); // Pass users to data.ejs
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Edit User Details
app.get("/data/edit/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const userDetails = await User.findById(id);
        res.render("edit.ejs", { userDetails });
    } catch (error) {
        console.error("Error fetching user for edit:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Update User Details
app.put("/data/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, number } = req.body;

    try {
        await User.findByIdAndUpdate(id, { name, email, number }, { runValidators: true });
        res.redirect("/data"); // Redirect to the data view
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Delete User
app.delete("/data/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await User.findByIdAndDelete(id);
        res.redirect("/data"); // Redirect to the data view
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(8080, () => {
    console.log("Connection Successful from Express Side");
});
