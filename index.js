const express = require("express");
const app = express();

const bodyParser = require("body-parser"),
  methodOverride = require("method-override");

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());
app.use(methodOverride());

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
  res.send("top 10 Movies");
});

app.listen(8080, () => console.log("Your app is listening on port 8080."));
