const jwt = require("jsonwebtoken");

const db = require("../dbConnectExec.js");
const rockwellConfig = require("../config.js");

const auth = async (req, res, next) => {
  // console.log("in the middleware", req.header("Authorization"));
  // next();

  try {
    //1. decode token
    let myToken = req.header("Authorization").replace("Bearer ", "");
    //console.log("token", myToken);

    let decoded = jwt.verify(myToken, rockwellConfig.JWT);
    console.log(decoded);

    let gymMemberPK = decoded.pk;

    //2. compare token with db
    let query = `SELECT MemberID, NameLast, NameFirst, Email
    FROM GymMember
    WHERE MemberID=${gymMemberPK} and token='${myToken}'`;

    let returnedUser = await db.executeQuery(query);
    console.log("returned user", returnedUser);

    //3. save user information in the request
    if (returnedUser[0]) {
      req.gymMember = returnedUser[0];
      next();
    } else {
      return res.status(401).send("invalid credentials");
    }
  } catch (err) {
    console.log(err);
    return res.status(401)("Invalid credentials");
  }
};

module.exports = auth;
