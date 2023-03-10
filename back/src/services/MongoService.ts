import { Collection, Document, MongoClient, ObjectId } from "mongodb";
import { Article, NewArticle } from "../interfaces/article";
import { AbstractService } from "./AbstractService";

export class MongoService extends AbstractService {
  myColl: Collection<Document>;
  constructor() {
    super();
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);
    const myDB = client.db("gestion-stock");
    this.myColl = myDB.collection("articles");
  }

  override async create(newArticle: NewArticle) {
    await this.myColl.insertOne(newArticle);
  }

  override async deleteAll() {
    await this.myColl.deleteMany();
  }

  override async deleteOne(id: string) {
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (err) {
      return false;
    }

    const result = await this.myColl.deleteOne({
      _id: objectId,
    });
    console.log("result: ", result);
    return result.deletedCount > 0;
  }

  override async getAll() {
    return [];
  }

  override async getOne(id: string): Promise<Article | undefined> {
    return undefined;
  }

  override async rewrite(id: string, article: Article) {}
}
