
// Dependencies
// -----------------------------------------------------
var express         = require('express');

var bodyParser      = require('body-parser');
var mysql = require("mysql");
var app             = express();
var db = require('./db');


// Express Configuration
// -----------------------------------------------------
// Sets the connection to MongoDB

// Logging and Parsing
                                    // log with Morgan
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.urlencoded({extended: true}));               // parse application/x-www-form-urlencoded
app.use(bodyParser.text());
app.use(express.static(__dirname + '/app'));
///app.use('/bower_components',  express.static(__dirname + '/bower_components'));
            // allows bodyParser to look at raw text

// Routes
// ------------------------------------------------------
// Listen
// -------------------------------------------------------
app.listen(3000);
console.log('App listening on port ' + 3000);
app.get('/',function(req,res){
     res.sendFile(__dirname+'/app/index.html');

});

app.get('/getReviews:placeId',function(req,res){
  var placeId = req.params.placeId;
  var queryString = 'SELECT * FROM `reviews` WHERE placeId = ?';
  db.query(queryString, [placeId], function(err, rows, fields) {
      if (err) throw err;
      else {
        var localData = [];
        for (var i in rows) {
          var obj ={
            "author_name": rows[i].name,
            "rating": rows[i].rating,
            "text": rows[i].review
          }
          localData.push(obj);
        }
        res.send(localData);
      }
  });
});

app.post('/saveReview', function(req, res, next){
   var query = db.query('INSERT INTO `reviews` SET ?', req.body, function(err, result) {
     if (err) {
       console.error(err);
       return res.send(err);
     } else {
       return res.send('Review Added successfully.');
     }
  });
   console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
});

