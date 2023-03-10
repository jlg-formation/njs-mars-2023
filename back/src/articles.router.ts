import { json, Router } from "express";
import { Article, NewArticle } from "./interfaces/article";
import { generateId } from "./misc";
import {
  newArticleSchema,
  partialArticleSchema,
} from "./schemas/article.schema";
import { RAMService } from "./services/RAMService";

const service = new RAMService();

const app = Router();

app.get("/", (req, res) => {
  const articles = service.getAll();
  res.json([...articles.values()]);
});

app.get("/:id", (req, res) => {
  const id = req.params.id;
  console.log("id: ", id);
  const article = service.getOne(id);
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
  // eslint-disable-next-line github/array-foreach
  newArticles.forEach((newArticle) => {
    service.create(newArticle);
  });
  res.status(201).end();
});

app.delete("/", (req, res) => {
  console.log("req.body: ", req.body);
  const contentLength = req.get("Content-Length");
  if (contentLength === undefined || contentLength === "0") {
    service.deleteAll();

    res.status(204).end();
    return;
  }
  const ids: string[] = req.body;
  for (const id of ids) {
    service.deleteOne(id);
  }

  res.status(204).end();
});

app.delete("/:id", (req, res) => {
  const id = req.params.id;
  const result = service.deleteOne(id);
  if (result === false) {
    res.status(404).end("not found");
    return;
  }
  res.status(204).end();
});

app.put("/:id", (req, res) => {
  const id = req.params.id;
  const newArticle: NewArticle = req.body;
  const result = newArticleSchema.validate(newArticle);
  if (result.error) {
    res.status(400).json(result);
    return;
  }
  const article = { ...newArticle, id };
  service.rewrite(id, article);
  res.status(204).end();
});

app.patch("/:id", (req, res) => {
  const id = req.params.id;
  const partialArticle: Partial<NewArticle> = req.body;
  const result = partialArticleSchema.validate(partialArticle);
  if (result.error) {
    res.status(400).json(result);
    return;
  }
  const origArticle = service.getOne(id);
  if (origArticle === undefined) {
    res.status(404).end();
    return;
  }
  const article = { ...origArticle, ...partialArticle };
  service.rewrite(id, article);
  res.status(204).end();
});

export default app;
