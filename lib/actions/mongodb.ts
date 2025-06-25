// eslint-disable no-var
// mongodb.js
// global.d.ts
// declare global {
//   var _mongoClientPromise: Promise<MongoClient>;
// }
// import { MongoClient, ServerApiVersion } from "mongodb";

// const uri = process.env.MONGODB_URI;
// const options = {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// };

// let client: MongoClient;

// if (!process.env.MONGODB_URI) {
//   throw new Error("Add Mongo URI to .env.local");
// }

// const getClient = async () => {
//   if (process.env.NODE_ENV === "development") {
//     if (!global._mongoClientPromise) {
//       if (!uri) {
//         throw new Error("MONGODB_URI is not set");
//       }
//       client = new MongoClient(uri);
//       global._mongoClientPromise = client.connect();
//     }
//     return global._mongoClientPromise;
//   } else {
//     if (!uri) {
//       throw new Error("MONGODB_URI is not set");
//     }
//     client = new MongoClient(uri, options);
//     return client.connect();
//   }
// };
// export const clientPromise = getClient();

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

const client = new MongoClient(uri);
const clientPromise = client.connect();

export { clientPromise };
