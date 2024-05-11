/*
 * Mongo Todo - Database API
 *
 * This module provides access to the database used by this web app.
 */

// Connect to database
const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1/mongo-todo";
const mongodb = require("mongodb");
const client = new mongodb.MongoClient(DB_URL);
module.exports = client.db();

// Create indexes
client.db().collection("tasks").createIndex({_id: 1});
