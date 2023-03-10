import { Article, NewArticle } from "../interfaces/article";

export abstract class AbstractService {
  abstract create(newArticle: NewArticle): Promise<void>;

  abstract deleteAll(): Promise<void>;

  abstract deleteOne(id: string): Promise<boolean>;

  abstract getAll(): Promise<Article[]>;

  abstract getOne(id: string): Promise<Article | undefined>;

  abstract rewrite(id: string, article: Article): Promise<void>;
}
