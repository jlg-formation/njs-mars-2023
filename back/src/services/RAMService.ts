import { Article, NewArticle } from "../interfaces/article";
import { generateId } from "../misc";
import { AbstractService } from "./AbstractService";

export class RAMService extends AbstractService {
  articles = new Map<string, Article>();

  override async create(newArticle: NewArticle) {
    const article = { ...newArticle, id: generateId() };
    this.articles.set(article.id, article);
  }

  override async deleteAll() {
    this.articles.clear();
  }

  override async deleteOne(id: string) {
    return this.articles.delete(id);
  }

  override async getAll() {
    return [...this.articles.values()];
  }

  override async getOne(id: string) {
    return this.articles.get(id);
  }

  override async rewrite(id: string, article: Article) {
    this.articles.set(id, article);
  }
}
