/*
    SETUP
*/

// Express
var express = require('express');
var app = express();

// app.js - SETUP section
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

// Port number
PORT = 55000;

// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.


// Routes
app.get('/', function(req, res){
    let query1 = "SELECT * FROM Movies;"    // Define query
    
    db.pool.query(query1, function(error, rows, fields){    // Execute query
        res.render('movies', {data: rows});
    })
});


app.get('/search', function(req, res){  // Displays movies based on users searched title
    let query1;

    if (req.query.searchedTitle === undefined || req.query.searchedTitle == ''){
        query1 = "SELECT * FROM Movies;";
    }
    else{
        let searchedTitle = req.query.searchedTitle;
        query1 = `SELECT * FROM Movies WHERE title LIKE '%${searchedTitle}%'`;
    }

    db.pool.query(query1, function(error, rows, fields){
        if (error){
            console.log(error);
            res.sendStatus(400);
        }
        else{
            res.render('movies', {data: rows});
        }
    })
});


app.post('/add-movie-html', function(req, res){ // Adds a movie to the database

    // Grab values from add-movie-html
    let data = req.body;

    let duration = parseInt(data['duration']);

    // Added the question marks to the queries because SQL doesn't like quotes in strings and movie descriptions are full of them
    let query1 = 'INSERT INTO Movies (title, description, duration) VALUES (?, ?, ?)';

    let inserts = [data.title, data.description, duration];


    db.pool.query(query1, inserts, function(error, rows, fields){
        // Check if there was an error
        if (error){
            console.log(error);
            res.sendStatus(400);    // Send HTTP response 400 to user
        }
        else{
            res.redirect('/');
        }
    })
});


app.post('/delete-movie', function(req, res){ // Deletes a movie from the database

    let movieID = req.body.movieID; 

    let query1 = `DELETE FROM Movies WHERE movieID = ${movieID};`;

    db.pool.query(query1, function(error, rows, fields){
        // Check if there was an error
        if (error){
            console.log(error);
            res.sendStatus(400);    // Send HTTP response 400 to user
        }
        else{
            res.redirect('/');
        }
    })
});


app.get('/movie/:id', function(req, res) {  // Got help with this function so not all mine
    // Get the movie ID from the URL parameters
    let movieID = req.params.id;
  
    // Query to get the movie data
    let query = 'SELECT * FROM Movies WHERE movieID = ?';
  
    db.pool.query(query, [movieID], function(error, rows, fields) {
        // Check if there was an error
        if (error){
          console.log(error);
          res.sendStatus(400);    // Send HTTP response 400 to user
        }
        else{
          // Respond with the movie data
          res.json(rows[0]);
          }
    });
});


app.post('/update-movie', function(req, res) {
    // Get the updated movie data from the request body
    let movie = req.body;

    let duration = parseInt(movie.duration);

    // Query to update the movie data
    let query = 'UPDATE Movies SET title = ?, description = ?, duration = ? WHERE movieID = ?';

    db.pool.query(query, [movie.title, movie.description, duration, movie.ID], function(error, rows, fields) {
        // Check if there was an error
        if (error){
          console.log(error);
          res.sendStatus(400);    // Send HTTP response 400 to user
        }
        else{
          // Redirect to the main page
          res.redirect('/');
        }
    });
});


// LISTENER
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
