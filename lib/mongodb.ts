import { MongoClient, Db } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add MONGODB_URI to .env.local')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the connection
  // across module reloads caused by HMR (Hot Module Replacement)
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, create a new client for each connection
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise

/**
 * Get the database instance
 */
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db()
}

/**
 * Get a specific collection
 */
export async function getCollection(collectionName: string) {
  const db = await getDatabase()
  return db.collection(collectionName)
}
