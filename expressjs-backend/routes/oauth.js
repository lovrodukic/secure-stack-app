import express from "express";
import dotenv from "dotenv";
import { generateAccessToken } from "../models/user-services.js";
import { OAuth2Client } from "google-auth-library";

const router = express.Router();

dotenv.config({ path: "./config.env" });

async function getUserData(access_token) {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );
  const data = await response.json();
  console.log("data", data);
}

router.get("/", async function (req, res, next) {
  const code = req.query.code;

  try {
    const redirectUrl = "https://localhost:8000/oauth";
    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectUrl
    );

    const result = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(result.tokens);
    const user = oAuth2Client.credentials;

    await getUserData(user.access_token);

    const token = generateAccessToken({ userid: user.id_token });
    res.redirect(303, `https://localhost:3000/landing?token=${token}`);
  } catch (err) {
    console.log("Error with signin with Google", err);
    res.redirect(303, "https://localhost:3000/");
  }
});

export default router;
