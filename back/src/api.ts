import express from "express";
import articles from "./articles.router";

const app = express.Router();

app.get("/date", (req, res) => {
  res.json({ date: new Date() });
});

app.use("/articles", articles);

export const api = app;
