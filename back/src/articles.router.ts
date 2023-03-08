import { json, Router } from "express";
import { generateId } from "./misc";

const app = Router();

const articles = [];

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

export default app;
