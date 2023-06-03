/**********************************************************************************
 * WEB422 – Assignment 2*
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: ______ Student ID: ___ Date: __2023/05/19____
 * Cyclic Link: ___
 * *********************************************************************************/

var express = require("express");
var path = require("path");
var app = express();
require("dotenv").config();
var cors = require("cors");
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", function (req, res) {
  res.sendFile(__dirname + path.join("/index.html"));
});

app.get("/api/movies", function (req, res) {
  const page = req.query.page;
  const perPage = req.query.perPage;
  const title = req.query.title;
  db.getAllMovies(page, perPage, title)
    .then((data) => res.status(201).send(data))
    .catch((err) => res.status(500).send(err));
});

app.get("/api/movies/:_id", function (req, res) {
  const Id = req.params._id;
  db.getMovieById(Id)
    .then((data) => res.status(201).send(data))
    .catch((err) => res.status(500).send(err));
});

app.put("/api/movies/:_id", function (req, res) {
  const Id = req.params._id;
  db.updateMovieById(Id)
    .then((data) => res.status(204).send(data))
    .catch((err) => res.status(500).send(err));
});

app.delete("api/movies/:_id", function (req, res) {
  const Id = req.params._id;
  db.updateMovieById(req.body, Id)
    .then((data) => res.status(204).send(data))
    .catch((err) => res.status(500).send(err));
});

app.post("/api/movies", function (req, res) {
  db.addNewMovie(req.body)
    .then((data) => res.status(201).send(data))
    .catch((err) => res.status(500).send(err));
});

app.get("*", (req, res) => {
  res.status(404).send("Not Found");
});

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
