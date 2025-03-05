require("dotenv").config();
const jwt = require("jsonwebtoken");
const { BadRequest } = require("../errors");

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new BadRequest("Please provide email and password");
  }

  const id = new Date().getDate();

  // create token
  // sign(1.payload 2. secret 3. secret options)
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    // this token will expires in 30 days
    expiresIn: "30d",
  });
  res.status(200).json({ msg: "user created", token });
};

const dashboard = async (req, res) => {
  // const authHeader = req.headers.authorization;
  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   throw new CustomAPIError("No token Provided", 401);
  // }
  // const token = authHeader.split(" ")[1];
  // verify token
  // try {
  // jwt.verify(1.token 2.secret string)
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   const luckyNumber = Math.floor(Math.random() * 100);
  //   res.status(200).json({
  //     msg: `Hello, ${decoded.username}`,
  //     secret: ` Here is your authorized data, your lucky number is ${luckyNumber}`,
  //   });
  // } catch (error) {
  //   throw new CustomAPIError("not authorized to access this route", 401);
  // }

  const luckyNumber = Math.floor(Math.random() * 100);

  res.status(200).json({
    msg: `Hello, ${req.user.username}`,
    secret: ` Here is your authorized data, your lucky number is ${luckyNumber}`,
  });
};

module.exports = {
  login,
  dashboard,
};
