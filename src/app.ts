import cookieParser from "cookie-parser";
import { Application } from "express";
import express from "express";
import cors from "cors";
import config from "./config";

const app: Application = express();
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;
