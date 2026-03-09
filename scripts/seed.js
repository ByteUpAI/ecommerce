import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import seed functions
import { seedCategories } from './seeds/categories.seed.js';
import { seedUsers } from './seeds/users.seed.js';
import { seedProducts } from './seeds/products.seed.js';
import { seedProductVariants } from './seeds/variants.seed.js';
import { seedContactUs } from './seeds/contactUs.seed.js';

// Setup ES module path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Define schemas
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    deletedAt: { type: Date, default: null, index: true }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    mrp: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    discountPercentage: { type: Number, required: true },
    media: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
    description: { type: String, required: true },
    variantConfig: {
        attributes: [{
            key: { type: String },
            label: { type: String },
            unit: { type: String },
            type: { type: String, enum: ['text', 'number', 'select'], default: 'text' },
            options: [{ type: String }]
        }]
    },
    specifications: { type: Map, of: String, default: {} },
    deletedAt: { type: Date, default: null, index: true }
}, { timestamps: true });

const productVariantSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    attributes: { type: Map, of: String, default: {} },
    mrp: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    discountPercentage: { type: Number, required: true },
    sku: { type: String, required: true, unique: true },
    stock: { type: Number, default: 0 },
    media: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
    deletedAt: { type: Date, default: null, index: true }
}, { timestamps: true });

const mediaSchema = new mongoose.Schema({
    asset_id: { type: String, required: true, trim: true },
    public_id: { type: String, required: true, trim: true },
    path: { type: String, required: true, trim: true },
    thumbnail_url: { type: String, required: true, trim: true },
    secure_url: { type: String, required: true, trim: true },
    alt: { type: String, trim: true },
    title: { type: String, trim: true },
    deletedAt: { type: Date, default: null, index: true }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    role: { type: String, required: true, enum: ['user', 'admin'], default: 'user' },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    isEmailVerified: { type: Boolean, default: false },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    deletedAt: { type: Date, default: null, index: true }
}, { timestamps: true });

// SiteConfig schema for contact us
const siteConfigSchema = new mongoose.Schema({
    key: { type: String, index: true },
    data: { type: mongoose.Schema.Types.Mixed, default: null },
}, { timestamps: true });

// Create models
const SiteConfig = mongoose.models.SiteConfig || mongoose.model('SiteConfig', siteConfigSchema, 'site_configs');
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema, 'categories');
const Product = mongoose.models.Product || mongoose.model('Product', productSchema, 'products');
const ProductVariant = mongoose.models.ProductVariant || mongoose.model('ProductVariant', productVariantSchema, 'productvariants');
const Media = mongoose.models.Media || mongoose.model('Media', mediaSchema, 'medias');
const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'YT-NEXTJS-ECOMMERCE',
            bufferCommands: false,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Main seed function
const runSeeder = async () => {
    try {
        console.log('🚀 Starting database seeding...\n');
        
        await connectDB();
        
        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await Promise.all([
            ProductVariant.deleteMany({}),
            Product.deleteMany({}),
            Media.deleteMany({}),
            Category.deleteMany({}),
            SiteConfig.deleteMany({ key: 'contact_us' })
        ]);
        console.log('✅ Cleared all data\n');
        
        // Seed in order
        const categories = await seedCategories(Category);
        const users = await seedUsers(User);
        const products = await seedProducts(Product, Media, categories);
        const variants = await seedProductVariants(ProductVariant, Media, products);
        const contactUs = await seedContactUs(SiteConfig);
        
        console.log('🎉 Database seeding completed!\n');
        console.log('📊 Summary:');
        console.log(`   - Categories: ${categories.length}`);
        console.log(`   - Products: ${products.length}`);
        console.log(`   - Variants: ${variants.length}`);
        console.log(`   - Media: ${await Media.countDocuments()}`);
        console.log(`   - Users: ${users.length}`);
        console.log(`   - Contact Us: configured`);
        console.log('\n🔑 Login Credentials:');
        console.log('   Email: puneetkandpal1997@gmail.com');
        console.log('   Password: admin123');
        
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
    }
};

// Run the seeder
runSeeder();
