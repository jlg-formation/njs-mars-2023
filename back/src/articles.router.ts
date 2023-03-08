import { json, Router } from "express";
import { generateId } from "./misc";

const app = Router();

let articles = [];

app.get("/", (req, res) => {
  res.json(articles);
});

app.use(json());

app.post("/", (req, res) => {
  const newArticle = req.body;
  const article = { ...newArticle, id: generateId() };
  articles.push(article);
  res.status(201).end();
});

app.delete("/", (req, res) => {
  articles = [];
  res.status(204).end();
});

export default app;
