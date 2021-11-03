const express = require("express");

const db = require("./dbConnectExec.js");

//create an app. The () run the main express function which will run the function
const app = express();

//Below is function with 2 arguments. 1st is the port number we want to listen to. 2nd is function to use once app is running on that port
app.listen(5000, () => {
  console.log(`app is running on port 5000`);
});

//Below is a get function. Takes 2 arguments. 1st the route path (or end point). 2nd is fnction.
//The 2nd functino takes 2 arguments. 1st is the request. 2nd is the response
app.get("/hi", (req, res) => {
  res.send("hello world");
});

//make a route for the home
app.get("/", (req, res) => {
  res.send("API is running");
});

// app.post();
// app.put();

app.get("/movies", (req, res) => {
  //get data from the database
  db.executeQuery(
    `SELECT *
  FROM movie
  LEFT JOIN Genre
  ON genre.GenrePK = movie.GenreFK`
  )
    .then((theResults) => {
      res.status(200).send(theResults);
    })
    .catch((myError) => {
      console.log(myError);
      res.status(500).send();
    });
});
