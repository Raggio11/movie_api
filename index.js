const express = require('express');
  morgan = require('morgan');
  mongoose = require('mongoose');
  Models = require('./models.js');
  bodyParser = require('body-parser');

  const Movies = Models.Movie;
  const Users = Models.User;

mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(morgan("common"));

app.use(express.static("public"));

app.use(bodyParser.json());

const passport = require('passport');
require('./passport');

const cors = require('cors');

let allowedOrigins = ['http://localhost:8080', 'https://peaceful-ocean-31920.herokuapp.com', 'http://localhost:1234', 'https://git.heroku.com/peaceful-ocean-31920.git', '*','https://60009a1abbc4ab000795bd0b--keen-saha-d09040.netlify.app'];



const { check, validationResult } = require('express-validator');

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));


let auth = require('./auth')(app);

//Welcome page-it is working
app.get("/", (_req, res) => {
  res.send("Welcome to myFlix!");
});

//Get all movies - it is working
app.get('/movies', passport.authenticate('jwt', { session: false }), (_req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//gets all users - it is working
app.get("/users", passport.authenticate('jwt', { session: false }),(_req, res) => {
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
app.get("/movies/:Title", passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get("/movies/Genres/:Title", passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get("/movies/Director/:Name", passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get("/users/:username", passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.post('/users',
[
   check('username', 'username is required').isLength({min: 5}),
   check('username', 'username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
   check('password', 'password is required').not().isEmpty(),
   check('email', 'email does not appear to be valid').isEmail()
 ], (req, res) => {

let errors = validationResult(req);

if (!errors.isEmpty()) {
  return res.status(422).json({ errors: errors.array() });
}

  let hashedPassword = Users.hashPassword(req.body.password);
  Users.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + 'already exists');
      } else {
        Users
          .create({
              username: req.body.username,
              password: hashedPassword,
              email: req.body.email,
              Birthdate: req.body.Birthdate
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
app.put('/users/:username',
[
check('username', 'username is required').isLength({min: 5}),
check('username', 'username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
check('password', 'password is required').not().isEmpty(),
check('email', 'email does not appear to be valid').isEmail()
], (req, res) => {

let errors = validationResult(req);

if (!errors.isEmpty()) {
  return res.status(422).json({ errors: errors.array()
});
}
  let hashedPassword = Users.hashPassword(req.body.password);
  Users.findOneAndUpdate({ username: req.params.username }, {
    $set:
    {
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      Birthdate: req.body.Birthdate
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
app.put('/users/:username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.delete('/users/:username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
