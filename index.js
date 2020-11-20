const express = require("express");
morgan = require("morgan");

const app = express();

app.use(morgan("common"));

app.use(express.static("public"));

let movies = [
  {
    title: "Spider-man (2002)",
    cast: "Tobey Maguire, Kristen Dunst, Willem Dafoe, James Franco ",
    director: "Sam Raimi",
    genre: "aciton"
  },
  {
    title: "Iron Man",
    cast: "Rober Downey Jr., Jon Favreau, Gwyneth Paltrow",
    director: "Jon Favreau",
    genre: "aciton"
  }
];

app.get("/", (req, res) => {
  res.send("Welcome to myFlix!");
});

app.get("/movies", (req, res) => {
  res.send("Got all the movies");
});

app.get("/movies/genre/:genre", (req, res) => {
  res.send("Got the genre: " + req.params.genre);
});

app.get("/movies/director/:name", (req, res) => {
  res.send("Got the director: " + req.params.name);
});

app.post("/users", (req, res) => {
  res.send("get a request for a new user");
});

app.put("/users/:username", (req, res) => {
  res.send("Put in a new Username: " + req.params.username);
});
app.post("/users/:username/:password", (req, res) => {
  res.send(
    "post in a new Username: " +
      req.params.username +
      " Password: " +
      req.params.password
  );
});
app.delete("/users/:username/:password", (req, res) => {
  res.send("delete a password: " + req.params.password);
});

app.delete("/users/:username", (req, res) => {
  res.send("delete a username: " + req.params.username);
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
