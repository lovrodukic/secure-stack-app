import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import https from "https";
import fs from "fs";
import authRouter from "./routes/oauth.js";
import requestRouter from "./routes/request.js";

dotenv.config({ path: "./config.env" });

const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.disable("x-powered-by");
app.use("/oauth", authRouter);
app.use("/request", requestRouter);

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
