/*
 * Mongo Todo - Task API
 *
 * This is the REST API for tasks in the todo list.
 */

// Import express and create a router
const express = require("express");
const router = express.Router();
module.exports = router;

// Define routes
router.post("/task", (req, res) => {
    // TODO: Implement Route Logic
    console.log(`Payload: ${req.body}`);
    res.send("Not Implemented");
});

router.get("/tasks", (req, res) => {
    // TODO: Implement Route Logic
    res.send("Not Implemented");
});

router.put("/task/:id", (req, res) => {
    // TODO: Implement Route Logic
    console.log(`ID: ${req.params.id}`);
    console.log(`Payload: ${req.body}`);
    res.send("Not Implemented");
});

router.delete("/task/:id", (req, res) => {
    // TODO: Implement Route Logic
    console.log(`ID: ${req.params.id}`);
    res.send("Not Implemented");
});
