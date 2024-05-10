/*
 * Mongo Todo - Unit Tests for Task API
 *
 * These are the unit tests for the task API.
 */

// Import node-fetch
const fetch = require("node-fetch");

// Connect to database
const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1/mongo-todo";
const mongodb = require("mongodb");
const client = new mongodb.MongoClient(DB_URL);

// Run tests
describe("Task", function() {
    describe("POST", function() {
        it("valid request", function(done) {
            // Post a new task
            fetch("http://127.0.0.1:8000/task", {
                method: "POST",
                body: JSON.stringify({
                    name: "Wash Laundry"
                })
            })
            .then((response) => {
                // Check response code
                if(response.status == 201) {
                    done();
                } else {
                    done({msg: `Response code was ${response.status}. Expected 201 instead.`});
                }
            })
            .catch((err) => {
                done(err);
            });
        });

        it("invalid request", function(done) {
            // Try to post a new task with invalid input
            fetch("http://127.0.0.1:8000/task", {
                method: "POST",
                body: JSON.stringify({
                    trash: "invalid trash"
                })
            })
            .then((response) => {
                // Check response code
                if(response.status == 400) {
                    done();
                } else {
                    done({msg: `Response code was ${response.status}. Expected 400 instead.`});
                }
            })
            .catch((err) => {
                done(err);
            });
        });
    });

    describe("GET", function() {
        it("valid request", function(done) {
            // Get all tasks
            fetch("http://127.0.0.1:8000/tasks")
            .then((response) => response.json())
            .then((payload) => {
                // Is the payload valid?
                const validPayload = {
                    tasks: [
                        {name: "Wash Laundry"}
                    ]
                };

                if(payload == validPayload) {
                    done();
                } else {
                    done({msg: "The received payload did not match the expected payload."});
                }
            })
            .catch((err) => {
                done(err);
            })
        });
    });

    describe("PUT", function() {
        it("valid request", function(done) {
            // Update a task
            fetch("http://127.0.0.1:8000/task/1", {
                method: "PUT",
                body: JSON.stringify({
                    completed: true
                })
            })
            .then((response) => {
                // Check response code
                if(response.status == 204) {
                    done();
                } else {
                    done({msg: `Response code was ${response.status}. Expected 204 instead.`});
                }
            })
            .catch((err) => {
                done(err);
            });
        });

        it("invalid request", function(done) {
            // Try invalid task update request
            fetch("http://127.0.0.1:8000/task/1", {
                method: "PUT",
                body: JSON.stringify({
                    trash: "invalid trash"
                })
            })
            .then((response) => {
                // Check response code
                if(response.status == 400) {
                    done();
                } else {
                    done({msg: `Response code was ${response.status}. Expected 400 instead.`});
                }
            })
            .catch((err) => {
                done(err);
            });
        });
    });

    describe("DELETE", function() {
        it("valid request", function(done) {
            // Delete a task
            fetch("http://127.0.0.1:8000/task/1", {
                method: "DELETE"
            })
            .then((response) => {
                // Check response code
                if(response.status == 204) {
                    done();
                } else {
                    done({msg: `Response code was ${response.status}. Expected 204 instead.`});
                }
            })
            .catch((err) => {
                done(err);
            })
        });

        it("invalid request", function(done) {
            // Try to send invalid delete request
            fetch("http://127.0.0.1:8000/task/250", {
                method: "DELETE"
            })
            .then((response) => {
                // Check response code
                if(response.status == 400) {
                    done();
                } else {
                    done({msg: `Response code was ${response.status}. Expected 400 instead.`});
                }
            })
        });
    });

    // Cleanup
    this.afterAll(function() {
        // Drop tasks collection
        client.db().dropCollection("tasks")
        .then(() => {
            client.close();
        });
    });
});
