# mongo-todo
A todo list REST API that demonstrates basic backend development concepts. This project is a single-tenant application intended for educational purposes and is not suitable for production.


## Required Software
* Node.js
* Visual Studio Code
* curl


## Tutorial
### Phase 1: Setup MongoDB
For this project, we will be developing a todo list backend that uses MongoDB for storage. Before we can start, we will need to setup MongoDB. There are multiple ways we can do this. We can install MongoDB locally or we can use MongoDB Atlas. I will give instructions for both methods.

#### Local Installation on Windows
1. visit https://www.mongodb.com/try/download/community
2. from the Package dropdown, choose "zip"
3. click the Download button
4. unzip the zip file in a convenient location
5. navigate to the `bin` folder within the extracted folder
6. inside you should see an executable called `mongod`
7. create a folder called `data` inside the `bin` folder
8. now open a terminal to the `bin` folder
9. execute `mongod --dbpath ./data` to start the database server and initialize the database

#### Local Installation on Linux
TODO

#### MongoDB Atlas
1. visit https://www.mongodb.com/cloud/atlas/register
2. create a MongoDB Atlas account
3. follow the provided instructions to setup a MongoDB Atlas cluster

### Phase 2: Setup Backend
Next we need to setup a new project for our backend. We will be using nodemon, express, and mongodb for our backend.

01. create a folder called `mongo-todo`
02. open the folder in VS Code
03. click Terminal > New Terminal
04. execute `npm init`
05. answer the prompts
06. execute `npm install --save-dev nodemon` to install nodemon
07. execute `npm install --save express mongodb` to install express and mongodb
08. create `index.js` with the following content:
```js
/*
 * Mongo Todo
 *
 * This is a todo list REST API that uses MongoDB for storage.
 */

// Import express and create an app object
const express = require("express");
const app = express();
const HOST = process.env.HOST || "127.0.0.1";
const PORT = parseInt(process.env.PORT || "8000");

// Define routes
app.get("/", (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Mongo Todo</title>
    </head>
    <body>
        <h1>Mongo Todo</h1>
    </body>
</html>`);
});

// Listen for incoming connections
app.listen(PORT, HOST, () => {
    console.log(`Listening at http://${HOST}:${PORT}/...`);
});
```
09. open `package.json` and add debug and start scripts like this:
```json
{
  ...
  "scripts": {
    "debug": "nodemon index.js",
    "start": "node index.js",
    ...
  }
  ...
}
```
10. execute `npm run debug` to start the backend
11. execute `curl http://127.0.0.1:8000` and you should see the following output:
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Mongo Todo</title>
    </head>
    <body>
        <h1>Mongo Todo</h1>
    </body>
</html>
```

### Phase 3: Connect Backend to MongoDB
Now that we have the basic framework for our backend completed, we need to connect it to our database. To do this, we will need to create a module that provides an API for connecting to our database server.

1. create `db.js` with the following content:
```js
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

            // Return the database object
            resolve(db);
        })
        .catch((err) => {
            reject(err);
        });
    });
};
```

### Phase 4: Setup REST API Routes
Next we need to setup our REST API routes. These routes will be used to manipulate data in the database via HTTP requests.

1. create a `routes` folder inside the project folder
2. create `routes/task.js` with the following content:
```js
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
```
3. open `index.js` and add the following to the end of your routes section:
```js
app.use("/api/v1/", require("./routes/task"));
```
4. you also need to add this above your routes section:
```js
// Configure middleware
app.use(express.json());
```
5. now you should be able to ping each route with curl like this:
```shell
curl -X POST --json "{\"name\": \"Wash Laundry\"}" http://127.0.0.1:8000/api/v1/task
curl http://127.0.0.1:8000/api/v1/tasks
curl -X PUT --json "{\"completed\": true}" http://127.0.0.1:8000/api/v1/task/1
curl -X DELETE http://127.0.0.1:8000/api/v1/task/1
```
6. right now each route should respond with "Not Implemented" and you should see some additional output in the server logs

### Phase 5: Unit Testing
As you may have noticed, testing each endpoint with curl becomes tedious and time-consuming. It's also easier to make a mistake while testing. Fortunately for us, there is a better way to test our REST API endpoints. If we install Mocha and node-fetch, we can do automated unit testing of our REST API endpoints. Mocha is a unit testing framework for Node.js and node-fetch provides a convenient way to send HTTP requests.

1. execute `npm install --save-dev mocha` to install Mocha
2. execute `npm install --save node-fetch@2.7.0` to install node-fetch
3. create a `test` folder inside your project folder
4. create `test/task.js` with the following content:
```js
/*
 * Mongo Todo - Unit Tests for Task API
 *
 * These are the unit tests for the task API.
 */

// Import node-fetch and db
const fetch = require("node-fetch");
let db = null;

require("../db")()
.then((_db) => {
    db = _db;
})
.catch((err) => {
    console.error(err);
});

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
        db.dropCollection("tasks")
        .then(() => {
            db.client.close();
        });
    });
});
```
5. open `package.json` and change the test script like this:
```json
{
  ...
  "scripts": {
    ...
    "test": "mocha"
  }
  ...
}
```
6. execute `npm test` to run the tests
7. at this point, all tests should fail since none of the REST API endpoints have been implemented

### Phase 6: Implement REST API Endpoints
Now that we have automated unit testing setup, we can implement our REST API endpoints and test them automatically.

1. open `routes/task.js`
2. add this code above the route definitions:
```js
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
```
3. replace the body of the route for the `POST /api/v1/task` endpoint with the following:
```js
// Validate task data
if(!req.body.name) {
    return res.status(400).end();
}

// Add the task to the database
db.collection("tasks").insertOne(req.body)
.then(() => {
    return res.status(201).end();
})
.catch((err) => {
    return res.status(500).json({msg: "A database error has occurred."});
});
```
4. replace the body of the route for the `GET /api/v1/tasks` endpoint with the following:
```js
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
```
5. replace the body of the route for the `PUT /api/v1/task/:id` endpoint with the following:
```js
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

db.collection("tasks").updateOne({_id: new ObjectId(req.params.id)}, {$set: updateData})
.then(() => {
    return res.status(204).end();
})
.catch((err) => {
    return res.status(500).json({msg: "A database error occurred."});
});
```
6. replace the body of the route for the `DELETE /api/v1/task/:id` endpoint with:
```js
// Delete the task
db.collection("tasks").deleteOne({_id: new ObjectId(req.params.id)})
.then(() => {
    return res.status(204).end();
})
.catch((err) => {
    return res.status(500).json({msg: "A database error occurred."});
});
```
7. execute `npm test` and all tests should pass now

### Phase 7: Optimization
Now that everything is working correctly, let's optimize our database. As it is right now, whenever we do a PUT or DELETE operation, MongoDB has to do a full scan of the collection in order to find the task we need to update or delete. This is very inefficient. Especially for large data sets. However, we can improve this by creating an index on the `_id` field of each document in our `tasks` collection.

1. open `db.js`
2. add the following code above the line where you resolve the promise:
```js
// Create indexes
client.db().collection("tasks").createIndex({_id: 1});
```
3. execute `npm test` and you should notice an improvement in speed
