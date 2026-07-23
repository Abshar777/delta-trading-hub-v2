import { MongoClient, type Db } from 'mongodb'

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'delta'

/* Cache the client across hot-reloads / serverless invocations. */
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

export function isDbConfigured() {
  return Boolean(uri)
}

/** Returns the connected Db, or null if MONGODB_URI is not set. */
export async function getDb(): Promise<Db | null> {
  if (!uri) return null
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri).connect()
  }
  const client = await global._mongoClientPromise
  return client.db(dbName)
}
