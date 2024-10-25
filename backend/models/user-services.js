import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import UserModel from "./user.js";

dotenv.config({ path: "./config.env" });

// connect to database
// mongoose.set("debug", true);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

const db = mongoose.connection;
db.once("connected", () => {
  console.log("Database connected successfuly");
});

function generateAccessToken(userid) {
  return jwt.sign(userid, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }

    req.user = user;

    next();
  });
}

async function authenticateUser(userid, password) {
  try {
    const user = await UserModel.findOne({ userid: userid });
    const result = await user.comparePassword(password);
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getUserByName(userid) {
  try {
    return await UserModel.find({ userid: userid });
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

function validatePassword(password) {
  const isLongEnough = password.length >= 12;
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);

  return isLongEnough && hasNumber && hasSymbol && hasUpper && hasLower;
}

async function addUser(user) {
  try {
    const userToAdd = new UserModel(user);
    const savedUser = await userToAdd.save();
    return savedUser;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getUsers() {
  return await UserModel.find();
}

export {
  generateAccessToken,
  authenticateToken,
  authenticateUser,
  getUserByName,
  validatePassword,
  addUser,
  getUsers,
};
