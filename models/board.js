// Importing Mongoose
const mongoose = require('mongoose');

// Creating a schema for the Board
const boardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// Creating a Board model based on the schema
const Board = mongoose.model('Board', boardSchema);

// Exporting the Board model
module.exports = { Board };
