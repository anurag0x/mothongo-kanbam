const mongoose = require("mongoose");

// Establishing a connection to MongoDB
const dbConnection = mongoose.connect(process.env.mongoUrl);

// Exporting the database connection
module.exports = { dbConnection };
