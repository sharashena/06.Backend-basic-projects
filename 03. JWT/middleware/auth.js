const jwt = require("jsonwebtoken");
const { Unauthenticated } = require("../errors");

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Unauthenticated("No token Provided");
  }

  const token = authHeader.split(" ")[1];
  try {
    // jwt.verify(1.token 2. jwt secret)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, username } = decoded;
    req.user = { id, username };
    next();
  } catch (error) {
    throw new Unauthenticated("not authorized to access this route");
  }
};

module.exports = authenticationMiddleware;
