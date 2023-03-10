const { MongoClient } = require("mongodb");
// Replace the uri string with your connection string.
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
console.log("client: ", client);
async function run() {
  try {
    const myDB = client.db("gestion-stock");
    console.log("myDB: ", myDB);
    const myColl = myDB.collection("pizzaMenu");
    console.log("myColl: ", myColl);
    const doc = { name: "Neapolitan pizza", shape: "round" };
    const result = await myColl.insertOne(doc);
    console.log("result: ", result);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
