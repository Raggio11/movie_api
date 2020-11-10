const express = require("express"),
  morgan = require("morgan");

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
  res.status(500).send("Opps and error has occured");
});
