import { json, Router } from "express";
import { Article, NewArticle } from "./interfaces/Article";
import { generateId } from "./misc";
import { newArticleSchema } from "./schemas/article.schema";

const app = Router();

const articles = new Map<string, Article>();

app.get("/", (req, res) => {
  res.json([...articles.values()]);
});

app.get("/:id", (req, res) => {
  const id = req.params.id;
  console.log("id: ", id);
  const article = articles.get(id);
  if (article === undefined) {
    res.status(404).send("not found");
    return;
  }
  res.json(article);
});

app.use(json());

app.post("/", (req, res) => {
  console.log("req.body: ", req.body);

  const newArticles: NewArticle[] =
    req.body instanceof Array ? req.body : [req.body];

  for (const newArticle of newArticles) {
    const result = newArticleSchema.validate(newArticle);
    if (result.error) {
      res.status(400).json(result);
      return;
    }
  }
  newArticles.forEach((newArticle) => {
    const article = { ...newArticle, id: generateId() };
    articles.set(article.id, article);
  });
  res.status(201).end();
});

app.delete("/", (req, res) => {
  console.log("req.body: ", req.body);
  const contentLength = req.get("Content-Length");
  if (contentLength === undefined || contentLength === "0") {
    articles.clear();
    res.status(204).end();
    return;
  }
  const ids: string[] = req.body;
  for (const id of ids) {
    articles.delete(id);
  }

  res.status(204).end();
});

app.delete("/:id", (req, res) => {
  const id = req.params.id;
  const result = articles.delete(id);
  if (result === false) {
    res.status(404).end("not found");
    return;
  }
  res.status(204).end();
});

export default app;
