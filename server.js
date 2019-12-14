var fs = require("fs");
var express = require("express");
var path = require("path");
var app = express();

var PORT = process.env.PORT || 8080;

var notes = [];

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(express.static("db"));

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));

    });

app.get("/api/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post("/api/notes", function (req, res) {
    fs.readFile(path.join(__dirname, "/db/db.json"), function (err, data) {
        notes = JSON.parse(data);
        req.body.id = notes.length + 1;
        notes.push(req.body)
        console.log(notes);
        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(notes), function () {
        });
    });
    res.sendFile(path.join(__dirname, "/public/notes.html"));

});

app.delete("/api/notes/:id", function (req, res) {
    fs.readFile(path.join(__dirname, "/db/db.json"), function (err, data) {
        notes = JSON.parse(data);
        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(notes.filter(note => note.id != req.params.id)), () => { console.log(`Note deleted`) });
        res.sendFile(path.join(__dirname, "/public/notes.html"));
    });
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});