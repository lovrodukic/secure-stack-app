import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import https from "https";
import fs from "fs";
import esapi from "node-esapi";
import {
  generateAccessToken,
  authenticateToken,
  authenticateUser,
  getUserByName,
  validatePassword,
  addUser,
  getUsers,
} from "./models/user-services.js";

dotenv.config({ path: "./config.env" });

const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.disable("x-powered-by");

https
  .createServer(
    {
      key: fs.readFileSync("./keys/key.pem"),
      cert: fs.readFileSync("./keys/cert.pem"),
    },
    app
  )
  .listen(port, () => {
    console.log(`App listening at https://localhost:${port}`);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

/*********************************   APIs   **********************************/

// authenticate user
app.post("/account/login", async (req, res) => {
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
app.post("/account/registration", async (req, res) => {
  const userToAdd = req.body;
  const matchingUser = await getUserByName(userToAdd.userid);

  if (validatePassword(userToAdd.password)) {
    if (!matchingUser.length) {
      const user = await addUser(userToAdd);
      const safeUser = {
        userid: esapi.encoder().encodeForHTML(user.userid),
        // not sure if we need to be sending back to pwd...
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
app.get("/users", authenticateToken, async (req, res) => {
  const users = await getUsers();

  if (users) {
    res.status(200).send(users);
  } else {
    res.status(401).send("Invalid credentials");
  }
});
