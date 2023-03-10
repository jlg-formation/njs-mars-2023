import { Article, NewArticle } from "../interfaces/article";
import { generateId } from "../misc";

export class RAMService {
  articles = new Map<string, Article>();

  create(newArticle: NewArticle) {
    const article = { ...newArticle, id: generateId() };
    this.articles.set(article.id, article);
  }

  deleteAll() {
    this.articles.clear();
  }

  deleteOne(id: string) {
    return this.articles.delete(id);
  }

  getAll() {
    return this.articles;
  }

  getOne(id: string) {
    return this.articles.get(id);
  }

  rewrite(id: string, article: Article) {
    this.articles.set(id, article);
  }
}
