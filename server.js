// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var bodyParser = require('body-parser');
var aws = require('aws-sdk')
require('dotenv').config();
var cors = require('cors');

var populateDb1 = require('./upload');
var populateDb2 = require('./upload2');
var populateDb3 = require('./upload3');
var populateLqDb1 = require('./upload_LQ1');
var populateLqDb2 = require('./upload_LQ2');
var populateLqDb3 = require('./upload_LQ3');
let exportResultMonth1 = require('./export/queryMonth1')
let exportResultMonth2 = require('./export/queryMonth2')
let exportResultMonth3 = require('./export/queryMonth3')
let dropAllTables = require('./dropTable')


// Sets up the Express App

// =============================================================
var app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './public/style.css')));

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, './app/views/index.html'));
});

app.post('/dropAllTables', (req, res) => {
  dropAllTables();
  //alert ('Data Uploaded')
  res.redirect('/');
});


app.post('/populateLqDb1', (req, res) => {
  populateLqDb1();

  //alert ('Data Uploaded')
  res.redirect('/');
});

app.post('/populateLqDb2', (req, res) => {
  populateLqDb2();
  //alert ('Data Uploaded')
  res.redirect('/');
});

app.post('/populateLqDb3', (req, res) => {
  populateLqDb3();
  //alert ('Data Uploaded')
  res.redirect('/');
});

app.post('/populateDb1', (req, res) => {
  populateDb1();
  //alert ('Data Uploaded')
  res.redirect('/');
});

app.post('/populateDb2', (req, res) => {
  populateDb2();
  //alert ('Data Uploaded')
  res.redirect('/');
});

app.post('/populateDb3', (req, res) => {
  populateDb3();
  //alert ('Data Uploaded')
  res.redirect('/');
});


app.post('/exportResultMonth', cors(), (req, res) => {
  exportResultMonth1();
  exportResultMonth2();
  exportResultMonth3();
  res.redirect('/');
});


// Routes
// =============================================================

// Starts the server to begin listening
// =============================================================

var server = app.listen(process.env.PORT || 5000, function () {
  var port = server.address().port;
  console.log("Express is working on port " + port);
});