import { MongoClient, Db, MongoClientOptions } from 'mongodb'

// Connection options for MongoDB Atlas (mongodb+srv handles SSL automatically)
const options: MongoClientOptions = {
  // Connection pool settings
  minPoolSize: 1,
  maxPoolSize: 10,
  // Timeout settings
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  // App identification
  appName: 'makeuslive',
}

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

/**
 * Get the MongoDB client promise (lazy initialization)
 */
function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI
  
  if (!uri) {
    throw new Error('Please add MONGODB_URI to your environment variables')
  }

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable to preserve the connection
    // across module reloads caused by HMR (Hot Module Replacement)
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect().catch((err) => {
        console.error('MongoDB connection error:', err)
        global._mongoClientPromise = undefined
        throw err
      })
    }
    return global._mongoClientPromise
  } else {
    // In production mode, reuse the connection
    if (!clientPromise) {
      client = new MongoClient(uri, options)
      clientPromise = client.connect().catch((err) => {
        console.error('MongoDB connection error:', err)
        clientPromise = null
        throw err
      })
    }
    return clientPromise
  }
}

export default getClientPromise

/**
 * Get the database instance
 */
export async function getDatabase(): Promise<Db> {
  const client = await getClientPromise()
  return client.db()
}

/**
 * Get a specific collection
 */
export async function getCollection(collectionName: string) {
  const db = await getDatabase()
  return db.collection(collectionName)
}

