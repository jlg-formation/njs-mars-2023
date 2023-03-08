import { json, Router } from "express";

const app = Router();

const articles = [];

app.get("/", (req, res) => {
  res.json(articles);
});

app.use(json());

app.post("/", (req, res) => {
  const article = req.body;
  articles.push(article);
  res.status(201).end();
});

export default app;
