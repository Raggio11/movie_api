const newLocal = "express";
const express = require(newLocal);
const newLocal_1 = "morgan";
morgan = require(newLocal_1);

bodyParser = require('body-parser'),

mongoose = require("mongoose");
Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect(
  "mongodb+srv://Raggio:ELQyag1JwMItgCF4@myflixdb.clhzr.mongodb.net/myFlixDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const app = express();

app.use(bodyParser.json());

app.use(morgan("common"));

app.use(express.static("public"));

//Welcome page-it is working
app.get("/", (_req, res) => {
  res.send("Welcome to myFlix!");
});

//Get all movies - it is working
app.get("/movies", (_req, res) => {
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
app.get("/users", (_req, res) => {
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

// Gets User by username - Works perfectly
app.get("/users/:username", (req, res) => {
  debugger;
  Users.findOne({ username: req.params.username })
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      console.error(err);s
      res.status(500).send("Error: " + err);
    });
});
// Allows to add new user - Works perfectly
app.post('/users', (req, res) => {
  Users.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + 'already exists');
      } else {
        Users
          .create({
              username: req.body.username,
              password: req.body.password,
              email: req.body.email,
              Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});
//Update user by username - it works!!
app.put('/users/:username', (req, res) => {
  Users.findOneAndUpdate({ username: req.params.username }, {
    $set:
    {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});
//add favorite movie to a specific user - It works
app.put('/users/:username/Movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ username: req.params.username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});
// Deletes a favorite movie from a user - it works
app.delete('/users/:username/Movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ username: req.params.username }, {
     $pull: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});
// Deletes a user by username - it works
app.delete('/users/:username', (req, res) => {
  Users.findOneAndRemove({ username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + ' was not found');
      } else {
        res.status(200).send(req.params.username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
