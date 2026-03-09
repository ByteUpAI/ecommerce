import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import models
import Category from '../models/Category.model.js';
import Product from '../models/Product.model.js';
import ProductVariant from '../models/ProductVariant.model.js';
import Media from '../models/Media.model.js';
import User from '../models/User.model.js';
import Order from './Order.model.js'; // Use local copy to avoid import issues
import Coupon from './Coupon.model.js'; // Use local copy to match schema
import Review from './Review.model.js'; // Use local copy to match schema

// Setup ES module path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'YT-NEXTJS-ECOMMERCE',
            bufferCommands: false
        });
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Clear all data
const clearAllData = async () => {
    try {
        console.log('🚀 Starting data cleanup...\n');
        
        await connectDB();
        
        // Clear collections in order (to respect foreign key constraints)
        console.log('🧹 Clearing collections...');
        
        const collections = [
            { name: 'Reviews', model: Review },
            { name: 'Orders', model: Order },
            { name: 'Coupons', model: Coupon },
            { name: 'Product Variants', model: ProductVariant },
            { name: 'Products', model: Product },
            { name: 'Media', model: Media },
            { name: 'Users', model: User },
            { name: 'Categories', model: Category }
        ];
        
        for (const collection of collections) {
            const result = await collection.model.deleteMany({});
            console.log(`   ✅ Cleared ${collection.name}: ${result.deletedCount} documents`);
        }
        
        console.log('\n🎉 Data cleanup completed successfully!');
        
    } catch (error) {
        console.error('❌ Error clearing data:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
    }
};

// Run the clear script
clearAllData();
