/* eslint-disable no-console */
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env') })

mongoose.set('bufferCommands', false)
mongoose.set('bufferTimeoutMS', 60000)

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('Missing MONGODB_URI environment variable')
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'YT-NEXTJS-ECOMMERCE',
      bufferCommands: false,
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 60000,
    })

    if (mongoose.connection?.db) {
      await mongoose.connection.db.admin().ping()
    }

    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}


async function main() {
  try {
    // Uses your existing DB connection helper (reads env like MONGODB_URI)
    await connectDB()

    const onlyNotDeleted = true

    const productFilter = onlyNotDeleted ? { deletedAt: null } : {}
    const variantFilter = onlyNotDeleted ? { deletedAt: null } : {}

    const db = mongoose.connection?.db
    if (!db) {
      throw new Error('MongoDB db handle not available')
    }

    const productsCol = db.collection('products')
    const variantsCol = db.collection('productvariants')

    const [productCount, variantCount] = await Promise.all([
      productsCol.countDocuments(productFilter),
      variantsCol.countDocuments(variantFilter),
    ])

    console.log('Matching products:', productCount)
    console.log('Matching variants:', variantCount)

    const productRes = await productsCol.updateMany(
      productFilter,
      { $set: { media: [] } },
      { maxTimeMS: 600000 }
    )

    const variantRes = await variantsCol.updateMany(
      variantFilter,
      { $set: { media: [] } },
      { maxTimeMS: 600000 }
    )

    console.log('Done.')
    console.log('Products updated:', productRes.modifiedCount ?? productRes.nModified)
    console.log('Variants updated:', variantRes.modifiedCount ?? variantRes.nModified)
  } catch (err) {
    console.error('Failed:', err)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

main();