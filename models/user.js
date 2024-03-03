// Importing Mongoose
const mongoose = require('mongoose');

// Creating a schema for the User
const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String },
    recentlyVisitedBoards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }]
  },
  { timestamps: true }
);

// Creating a User model based on the schema
const User = mongoose.model('User', userSchema);

// Exporting the User model
module.exports = { User };
