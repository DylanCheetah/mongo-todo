# mongo-todo
A todo list REST API that demonstrates basic backend development concepts.


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
Now that we have the basic framework for our backend completed, we need to connect it to our database. To do this, we will need to add some additional code after we create our app object and before we define our routes.

1. open `index.js` and add the following code before the section where we define the routes:
```js
...
// Connect to database
const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1/mongo-todo";
const mongodb = require("mongodb");
const client = new mongodb.MongoClient(DB_URL);
...
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
app.use(require("./routes/task"));
```
4. you also need to add this above your routes section:
```js
// Configure middleware
app.use(express.json());
```
5. now you should be able to ping each route with curl like this:
```shell
curl -X POST --json "{\"name\": \"Wash Laundry\"}" http://127.0.0.1:8000/task
curl http://127.0.0.1:8000/tasks
curl -X PUT --json "{\"completed\": true}" http://127.0.0.1:8000/task/1
curl -X DELETE http://127.0.0.1:8000/task/1
```
6. right now each route should respond with "Not Implemented" and you should see some additional output in the server logs
