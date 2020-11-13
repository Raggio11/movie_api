const express = require("express");
morgan = require("morgan");

const app = express();

app.use(morgan("common"));

app.use(express.static("public"));

let topTenMovies = [
  {
    title: "Spider-man (2002)",
    cast: "Tobey Maguire, Kristen Dunst, Willem Dafoe, James Franco "
  },
  {
    title: "Iron Man",
    cast: "Rober Downey Jr., Jon Favreau, Gwyneth Paltrow"
  }
];

app.get("/", (req, res) => {
  res.send("Welcome to myFlix!");
});

app.get("/movies", (req, res) => {
  res.json(topTenMovies);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(8080, () => console.log("Your app is listening on port 8080."));
