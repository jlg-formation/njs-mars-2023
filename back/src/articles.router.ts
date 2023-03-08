import { Router } from "express";

const app = Router();

const articles = [];

app.get("/", (req, res) => {
  res.json(articles);
});

export default app;
