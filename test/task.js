/*
 * Mongo Todo - Unit Tests for Task API
 *
 * These are the unit tests for the task API.
 */

// Import node-fetch and db
const fetch = require("node-fetch");
const db = require("../db");

// Run tests
describe("Task", function() {
    let taskID = null;

    describe("POST", function() {
        it("valid request", function(done) {
            // Post a new task
            fetch("http://127.0.0.1:8000/api/v1/task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
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
            fetch("http://127.0.0.1:8000/api/v1/task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
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
            fetch("http://127.0.0.1:8000/api/v1/tasks")
            .then((response) => response.json())
            .then((payload) => {
                // Is the payload valid?
                if(payload.tasks.length && payload.tasks[0].name == "Wash Laundry") {
                    taskID = payload.tasks[0]._id;
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
            fetch(`http://127.0.0.1:8000/api/v1/task/${taskID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
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
            fetch(`http://127.0.0.1:8000/api/v1/task/${taskID}`, {
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

        it("verify data integrity", function(done) {
            // Fetch all tasks
            fetch("http://127.0.0.1:8000/api/v1/tasks")
            .then((response) => response.json())
            .then((payload) => {
                // Check if task "Wash Laundry" is now completed
                if(payload.tasks[0].completed) {
                    done();
                } else {
                    done({msg: "Task 'Wash Laundry' was not completed."})
                }
            })
            .catch((err) => {
                done(err);
            })
        });
    });

    describe("DELETE", function() {
        it("valid request", function(done) {
            // Delete a task
            fetch(`http://127.0.0.1:8000/api/v1/task/${taskID}`, {
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
            fetch("http://127.0.0.1:8000/api/v1/task/250", {
                method: "DELETE"
            })
            .then((response) => {
                // Check response code
                if(response.status == 500) {
                    done();
                } else {
                    done({msg: `Response code was ${response.status}. Expected 500 instead.`});
                }
            })
        });

        it("verify data integrity", function(done) {
            // Fetch all tasks
            fetch("http://127.0.0.1:8000/api/v1/tasks")
            .then((response) => response.json())
            .then((payload) => {
                // Check if the tasks list is empty
                if(!payload.tasks.length) {
                    done();
                } else {
                    done({msg: "The task list should be empty but it isn't."});
                }
            })
            .catch((err) => {
                done(err);
            });
        });
    });

    // Cleanup
    this.afterAll(function() {
        // Drop tasks collection
        /* db.dropCollection("tasks")
        .then(() => {
            db.client.close();
        }); */
        db.client.close();
    });
});
