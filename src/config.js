const mongoose = require("mongoose");

const connect = mongoose.connect("mongodb+srv://mahbubanih:wfmQyK9L40jk4fOE@ampirialtask.z4mplzc.mongodb.net/", {
});

// Check if database connected successfully
connect.then(() => {
  console.log("Database Connected successfully");
}).catch((err) => {
  console.error("Database connection error:", err);
});

// Create a schema
const LoginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// Create model from schema
const collection = mongoose.model("users", LoginSchema);

module.exports = collection;
