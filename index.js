const express = require("express");
morgan = require("morgan");

const app = express();

app.use(morgan("common"));
app.use(bodyParser.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

let myLogger = (req, res, next) => {
  console.log(req.url);
  next();
};

app.get("/", (req, res) => {
  res.send("This is for all the movies");
});

app.use(express.static("/documentation"), (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.get("/movies", (req, res) => {
  res.json("top 10 Movies");
});

app.listen(8080, () => console.log("Your app is listening on port 8080."));
