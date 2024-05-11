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

// Configure middleware
app.use(express.json());

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

app.use("/api/v1/", require("./routes/task"));

// Listen for incoming connections
app.listen(PORT, HOST, () => {
    console.log(`Listening at http://${HOST}:${PORT}/...`);
});
