const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const app = express();
const collection = require("./config");
const { checkPrime } = require("crypto");

// Convert data into JSON format
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use EJS as the view engine
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

// Register User
app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password,
        mobileno: req.body.mobileno,
        email: req.body.email,
        source: req.body.source
    };

    try {
        // Check if the user already exists in the database
        const existingUser = await collection.findOne({ name: data.name });
        if (existingUser) {
            return res.send("User already exists. Please choose a different username.");
        }

        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for encryption
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword; // Replace the plain text password with the hashed password

        // Insert the new user data into the database
        const userData = await collection.insertMany(data);
        console.log("User registered successfully:", userData);
        res.redirect("/home"); // Redirect to homepage or any other page after successful registration
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Error registering user. Please try again later.");
    }
});

// Login Route
// Login Route
app.post("/login", async (req, res) => {
    try {
        const user = await collection.findOne({ name: req.body.username });
        if (!user) {
            return res.send("User is not registered");
        }

        // Compare hashed password with plain text
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (isPasswordMatch) {
            // User is authenticated, proceed with login
            res.render("home"); // Render homepage
        } else {
            res.send("Invalid password");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.send("Error logging in. Please try again later.");
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});
