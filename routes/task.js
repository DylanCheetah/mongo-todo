/*
 * Mongo Todo - Task API
 *
 * This is the REST API for tasks in the todo list.
 */

// Import express and create a router
const express = require("express");
const router = express.Router();
module.exports = router;

// Import database API
let db = null;

require("../db")()
.then((_db) => {
    db = _db;
})
.catch((err) => {
    console.error(err);
});

const ObjectId = require("mongodb").ObjectId;

// Define routes
router.post("/task", (req, res) => {
    // Validate task data
    if(!req.body.name) {
        return res.status(400).json({msg: "Field 'name' is required."});
    }

    // Add the task to the database
    db.collection("tasks").insertOne({
        name: req.body.name
    })
    .then(() => {
        return res.status(201).end();
    })
    .catch((err) => {
        return res.status(500).json({msg: "A database error has occurred."});
    });
});

router.get("/tasks", (req, res) => {
    // Fetch all tasks from the database
    db.collection("tasks").find().toArray()
    .then((tasks) => {
        return res.json({
            tasks: tasks
        });
    })
    .catch((err) => {
        return res.status(500).json({msg: "A database error has occurred."});
    });
});

router.put("/task/:id", (req, res) => {
    // Validate update data
    if(!req.body.name && !req.body.completed) {
        return res.status(400).json({msg: "Field 'name' or 'completed' is required."});
    }

    // Update the given task
    const updateData = {};

    if(req.body.name) {
        updateData.name = req.body.name;
    }

    if(req.body.completed) {
        updateData.completed = req.body.completed;
    }

    db.collection("tasks").updateOne({_id: ObjectId.createFromHexString(req.params.id)}, {$set: updateData})
    .then(() => {
        return res.status(204).end();
    })
    .catch((err) => {
        return res.status(500).json({msg: "A database error occurred."});
    });
});

router.delete("/task/:id", (req, res) => {
    // Delete the task
    console.log(req.params);
    db.collection("tasks").deleteOne({_id: ObjectId.createFromHexString(req.params.id)})
    .then(() => {
        return res.status(204).end();
    })
    .catch((err) => {
        return res.status(500).json({msg: "A database error occurred."});
    });
});
