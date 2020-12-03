const express = require("express");
morgan = require("morgan");

mongoose = require("mongoose");
Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();

app.use(morgan("common"));

app.use(express.static("public"));

//Welcome page-it is working
app.get("/", (req, res) => {
  res.send("Welcome to myFlix!");
});

//Get all movies - it is working
app.get("/movies", (req, res) => {
  Movies.find()
    .then(movies => {
      res.status(201).json(movies);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//gets all users - it is working
app.get("/users", (req, res) => {
  Users.find()
    .then(users => {
      res.status(201).json(users);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
//Get movies by title- it works
app.get("/movies/:Title", (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then(movie => {
      res.status(201).json(movie);
    })
    .catch(err => {
      console.err(err);
      res.status(500).send("Error: " + err);
    });
});
//Get the Genre and discription by movie title - it works.
app.get("/movies/Genres/:Title", (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then(movie => {
      res.status(201).json(movie.Genre.Name + ". " + movie.Genre.Description);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
// Gets director by name - works perfectly
app.get("/movies/Director/:Name", (req, res) => {
  Movies.findOne({ "Director.Name": req.params.Name })
    .then(movie => {
      res
        .status(201)
        .json(
          movie.Director.Name +
            ": " +
            movie.Director.Bio +
            ": " +
            movie.Director.Birth
        );
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Gets User by Username - Kinda works. may need future update
app.get("/users/:Username", (req, res) => {
  Users.findOne({ Username: req.params.username })
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
// Allows to add new user - can not get it to work
app.post("/users", (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then(users => {
      if (users) {
        return res.status(400).send(req.body.Username + " already exists");
        console.log("middle section");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthdate: req.body.Birthdate
        })
          .then(users => {
            res.status(201).json(users);
          })
          .catch(error => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

app.post("/users/:Username/Movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $push: { FavoriteMovies: req.params._id } }
  );
});

app.delete("/users/:Username/Movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $pull: { FavoriteMovies: req.params.MovieID } }
  );
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
