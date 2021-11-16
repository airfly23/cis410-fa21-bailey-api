const auth = async (req, res, next) => {
  console.log("in the middleware", req.header("Authorization"));
  next();
};

module.exports = auth;
