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
  (async () => {
    const articles = await service.getAll();
    res.json(articles);
  })();
});

app.get("/:id", (req, res) => {
  (async () => {
    try {
      const id = req.params.id;
      console.log("id: ", id);
      const article = await service.getOne(id);
      if (article === undefined) {
        res.status(404).send("not found");
        return;
      }
      res.json(article);
    } catch (err) {
      res.status(500).end();
    }
  })();
});

app.use(json());

app.post("/", (req, res) => {
  (async () => {
    try {
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
      for (const newArticle of newArticles) {
        await service.create(newArticle);
      }
      res.status(201).end();
    } catch (err) {
      console.log("err: ", err);
      res.status(500).end();
    }
  })();
});

app.delete("/", (req, res) => {
  (async () => {
    try {
      console.log("req.body: ", req.body);
      const contentLength = req.get("Content-Length");
      if (contentLength === undefined || contentLength === "0") {
        await service.deleteAll();

        res.status(204).end();
        return;
      }
      const ids: string[] = req.body;
      for (const id of ids) {
        await service.deleteOne(id);
      }

      res.status(204).end();
    } catch (err) {
      console.log("err: ", err);
      res.status(500).end();
    }
  })();
});

app.delete("/:id", (req, res) => {
  (async () => {
    try {
      const id = req.params.id;
      const result = await service.deleteOne(id);
      if (result === false) {
        res.status(404).end("not found");
        return;
      }
      res.status(204).end();
    } catch (err) {
      console.log("err: ", err);
      res.status(500).end();
    }
  })();
});

app.put("/:id", (req, res) => {
  (async () => {
    try {
      const id = req.params.id;
      const newArticle: NewArticle = req.body;
      const result = newArticleSchema.validate(newArticle);
      if (result.error) {
        res.status(400).json(result);
        return;
      }
      const article = { ...newArticle, id };
      await service.rewrite(id, article);
      res.status(204).end();
    } catch (err) {
      console.log("err: ", err);
      res.status(500).end();
    }
  })();
});

app.patch("/:id", (req, res) => {
  (async () => {
    try {
      const id = req.params.id;
      const partialArticle: Partial<NewArticle> = req.body;
      const result = partialArticleSchema.validate(partialArticle);
      if (result.error) {
        res.status(400).json(result);
        return;
      }
      const origArticle = await service.getOne(id);
      if (origArticle === undefined) {
        res.status(404).end();
        return;
      }
      const article = { ...origArticle, ...partialArticle };
      await service.rewrite(id, article);
      res.status(204).end();
    } catch (err) {
      console.log("err: ", err);
      res.status(500).end();
    }
  })();
});

export default app;
