/*
 * Mongo Todo - Database API
 *
 * This module provides access to the database used by this web app.
 */

// Import mongodb and create a database client
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(process.env.DB_URL || "mongodb://127.0.0.1/mongo-todo");
let db = null;

module.exports = function() {
    return new Promise((resolve, reject) => {
        // If a connection has already been established, return the cached database object
        if(db) {
            return resolve(db);
        }

        // Connect to the database
        client.connect()
        .then(() => {
            // Cache the database object
            db = client.db();

            // Create indexes
            client.db().collection("tasks").createIndex({_id: 1});

            // Return the database object
            resolve(db);
        })
        .catch((err) => {
            reject(err);
        });
    });
};
