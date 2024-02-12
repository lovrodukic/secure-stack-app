import express from "express";
import dotenv from "dotenv";
import esapi from "node-esapi";
import { OAuth2Client } from "google-auth-library";
import {
  generateAccessToken,
  authenticateToken,
  authenticateUser,
  getUserByName,
  validatePassword,
  addUser,
  getUsers,
} from "../models/user-services.js";

const router = express.Router();

dotenv.config({ path: "./config.env" });

router.post("/", async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://localhost:3000");

  res.header("Referrer-Policy", "no-referrer-when-downgrade");

  const redirectUrl = "http://127.0.0.1:8000/oauth";

  const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    redirectUrl
  );

  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/userinfo.profile openid",
    prompt: "consent",
  });

  res.json({ url: authorizeUrl });
});

// authenticate user
router.post("/account/login", async (req, res) => {
  const userToCheck = req.body;
  const auth = await authenticateUser(userToCheck.userid, userToCheck.password);

  if (auth) {
    const token = generateAccessToken({ userid: userToCheck.userid });
    res.status(200).json(token);
  } else {
    res.status(401).send("Invalid credentials");
  }
});

// create a new user
router.post("/account/registration", async (req, res) => {
  const userToAdd = req.body;
  const matchingUser = await getUserByName(userToAdd.userid);

  if (validatePassword(userToAdd.password)) {
    if (!matchingUser.length) {
      const user = await addUser(userToAdd);
      const safeUser = {
        userid: esapi.encoder().encodeForHTML(user.userid),
        password: esapi.encoder().encodeForHTML(user.password),
      };
      res.status(201).send(safeUser);
    } else {
      res.status(409).send("Conflicting username");
    }
  } else {
    res.status(400).send("Insufficient password strength");
  }
});

// get all users
router.get("/users", authenticateToken, async (req, res) => {
  const users = await getUsers();

  if (users) {
    res.status(200).send(users);
  } else {
    res.status(401).send("Invalid credentials");
  }
});

export default router;
