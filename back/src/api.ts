import express from "express";
import articles from "./articlesRouter";

const app = express.Router();

app.get("/date", (req, res) => {
  res.json({ date: new Date() });
});

app.use("/articles", articles);

export const api = app;
