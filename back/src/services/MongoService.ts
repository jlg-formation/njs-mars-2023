import { Collection, Document, MongoClient, ObjectId } from "mongodb";
import { Article, NewArticle } from "../interfaces/article";
import { AbstractService } from "./AbstractService";
import { translate } from "./mongo/misc";

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
    const result = await this.myColl.find().toArray();
    console.log("result: ", result);
    return result.map((doc) => translate<Article>(doc));
  }

  override async getOne(id: string): Promise<Article | undefined> {
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (err) {
      return undefined;
    }

    const result = await this.myColl.findOne({
      _id: objectId,
    });
    console.log("result: ", result);
    if (result === null) {
      return undefined;
    }
    return translate<Article>(result);
  }

  override async rewrite(id: string, article: Article) {
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (err) {
      return;
    }

    const doc: Document = { ...article };
    delete doc.id;
    const result = await this.myColl.findOneAndReplace(
      {
        _id: objectId,
      },
      doc
    );
    console.log("result: ", result);
  }
}
