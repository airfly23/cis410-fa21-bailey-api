const { response } = require("express");

const express = require("express");
const bcrypt = require("bcryptjs");

const db = require("./dbConnectExec.js");

//create an app. The () run the main express function which will run the function
const app = express();

//Tell app to recognize incoming request as JSON data
app.use(express.json());

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

//Create endpoint for signing up
app.post("/GymMember", async (req, res) => {
  // res.send("/gym member called");
  //Pick off the request
  // console.log("request body", req.body);

  let nameLast = req.body.NameLast;
  let nameFirst = req.body.NameFirst;
  let email = req.body.Email;
  let phoneNumber = req.body.PhoneNumber;
  let addressNumber = req.body.AddressNumber;
  let city = req.body.City;
  let state = req.body.State;
  let zip = req.body.Zip;
  let password = req.body.Password;

  //Checking for validation
  if (
    !nameLast ||
    !nameFirst ||
    !email ||
    !phoneNumber ||
    !addressNumber ||
    !city ||
    !state ||
    !zip ||
    !password
  ) {
    return res.status(400).send("Bad request");
  }

  nameLast = nameLast.replace("'", "''");
  nameFirst = nameFirst.replace("'", "''");

  let emailCheckQuery = `SELECT Email
  FROM Gym Member
  WHERE Email = '${email}'`;

  let existingUser = await db.executeQuery(emailCheckQuery);

  // console.log("existing user", existingUser);

  if (existingUser[0]) {
    return res.status(409).send("Duplicate email");
  }

  let hashedPassword = bcrypt.hashSync(password);

  //Register information
  let insertQuery = `INSERT INTO [Gym Member](NameLast, NameFirst, Email, PhoneNumber, AddressNumber, City, State, Zip, Password)
  VALUES('${nameLast}', '${nameFirst}', '${email}', '${phoneNumber}', '${addressNumber}', '${city}', '${state}', '${zip}', '${hashedPassword}')`;

  db.executeQuery(insertQuery)
    .then(() => {
      res.status(201).send();
    })
    .catch((err) => {
      console.log("error in POST /Gym Member", err);
      res.status(500).send();
    });
});

app.get("/gym", (req, res) => {
  //get data from the database
  db.executeQuery(
    `SELECT *
    FROM Gym1
    LEFT JOIN Class
    ON class.ClassID = Gym1.ClassIDFK`
  )
    .then((theResults) => {
      res.status(200).send(theResults);
    })
    .catch((myError) => {
      console.log(myError);
      res.status(500).send();
    });
});
