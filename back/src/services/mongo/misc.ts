import { WithId, Document } from "mongodb";

export const translate = <T>(doc: WithId<Document>) => {
  const id = doc._id.toHexString();
  const result: Document = { id, ...doc };
  delete result._id;
  return result as T;
};
