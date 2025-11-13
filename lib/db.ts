import mongoose from "mongoose"
import { initAdminUser } from "./initAdmin"

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongooseCache: MongooseCache | undefined
}

let cached: MongooseCache

if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null }
}
cached = global.mongooseCache

export async function dbConnect() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error("Please define the MONGODB_URI environment variable")

    cached.promise = mongoose.connect(uri).then((mongooseInstance) => {
      console.log("✅ MongoDB connecté :", mongooseInstance.connection.host)
      return mongooseInstance
    })
  }

  cached.conn = await cached.promise
  await initAdminUser()

  return cached.conn
}
