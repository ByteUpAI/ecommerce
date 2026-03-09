import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Create models
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema, 'categories');
const Product = mongoose.models.Product || mongoose.model('Product', productSchema, 'products');
const ProductVariant = mongoose.models.ProductVariant || mongoose.model('ProductVariant', productVariantSchema, 'productvariants');
const Media = mongoose.models.Media || mongoose.model('Media', mediaSchema, 'medias');
const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');

// Industrial catalog data based on PDF
const catalogData = {
    categories: [
        {
            name: "Pneumatic Cylinders",
            slug: "pneumatic-cylinders",
            products: [
                {
                    name: "DNC Pneumatic Cylinder",
                    slug: "dnc-pneumatic-cylinder",
                    description: "<h3>ISO Standard DNC Cylinder</h3><p>High-performance ISO standard pneumatic cylinder for industrial automation applications. Built with precision-machined components for reliable operation.</p><h4>Features:</h4><ul><li>ISO 15552 compliant design</li><li>Double-acting operation</li><li>Magnetic piston for sensor mounting</li><li>Hardened piston rod</li><li>High-grade aluminum alloy body</li></ul>",
                    variantConfig: {
                        attributes: [
                            { key: "diameter", label: "Bore Diameter", unit: "mm", type: "select", options: ["32", "40", "50", "63", "80", "100", "125"] },
                            { key: "stroke", label: "Stroke Length", unit: "mm", type: "number" },
                            { key: "mounting", label: "Mounting Type", type: "select", options: ["Foot", "Flange", "Trunnion"] }
                        ]
                    },
                    specifications: {
                        "Operating Pressure": "1-10 bar",
                        "Operating Temperature": "-10°C to 60°C",
                        "Piston Speed": "50-1000 mm/s",
                        "Material": "Aluminum alloy body, hardened steel rod"
                    },
                    variants: [
                        { diameter: "32", stroke: "50", mounting: "Foot" },
                        { diameter: "40", stroke: "100", mounting: "Foot" },
                        { diameter: "50", stroke: "150", mounting: "Flange" },
                        { diameter: "63", stroke: "200", mounting: "Foot" },
                        { diameter: "80", stroke: "250", mounting: "Trunnion" },
                        { diameter: "100", stroke: "300", mounting: "Foot" },
                        { diameter: "125", stroke: "400", mounting: "Flange" }
                    ]
                },
                {
                    name: "ADVU Compact Cylinder",
                    slug: "advu-compact-cylinder",
                    description: "<h3>Compact Pneumatic Cylinder</h3><p>Space-saving compact design ideal for applications with limited installation space. Features integrated magnetic sensors for position detection.</p><h4>Features:</h4><ul><li>Compact and lightweight design</li><li>Double-acting with cushioning</li><li>Integrated sensor groove</li><li>Non-rotating piston rod</li><li>Extended service life</li></ul>",
                    variantConfig: {
                        attributes: [
                            { key: "diameter", label: "Bore Diameter", unit: "mm", type: "select", options: ["16", "20", "25", "32", "40", "50", "63", "80", "100"] },
                            { key: "stroke", label: "Stroke Length", unit: "mm", type: "number" }
                        ]
                    },
                    specifications: {
                        "Operating Pressure": "1-10 bar",
                        "Operating Temperature": "-10°C to 60°C",
                        "Material": "Aluminum alloy"
                    },
                    variants: [
                        { diameter: "16", stroke: "25" },
                        { diameter: "20", stroke: "50" },
                        { diameter: "25", stroke: "75" },
                        { diameter: "32", stroke: "100" },
                        { diameter: "40", stroke: "125" },
                        { diameter: "50", stroke: "150" },
                        { diameter: "63", stroke: "200" }
                    ]
                },
                {
                    name: "DSNU Round Cylinder",
                    slug: "dsnu-round-cylinder",
                    description: "<h3>Round Body Pneumatic Cylinder</h3><p>Compact round body cylinder with excellent rigidity and space efficiency. Perfect for point-to-point applications.</p>",
                    variantConfig: {
                        attributes: [
                            { key: "diameter", label: "Bore Diameter", unit: "mm", type: "select", options: ["12", "16", "20", "25"] },
                            { key: "stroke", label: "Stroke Length", unit: "mm", type: "number" }
                        ]
                    },
                    specifications: {
                        "Operating Pressure": "1-10 bar",
                        "Material": "Stainless steel body"
                    },
                    variants: [
                        { diameter: "12", stroke: "25" },
                        { diameter: "16", stroke: "50" },
                        { diameter: "20", stroke: "75" },
                        { diameter: "25", stroke: "100" }
                    ]
                }
            ]
        },
        {
            name: "Cylinder Mountings & Accessories",
            slug: "cylinder-mountings-accessories",
            products: [
                {
                    name: "Magnetic Reed Switch",
                    slug: "magnetic-reed-switch",
                    description: "<h3>Magnetic Reed Switch for Cylinders</h3><p>High-reliability magnetic reed switch for pneumatic cylinder position sensing. Easy installation with standard mounting grooves.</p>",
                    variantConfig: {
                        attributes: [
                            { key: "type", label: "Switch Type", type: "select", options: ["NPN", "PNP", "2-Wire"] },
                            { key: "voltage", label: "Operating Voltage", unit: "V", type: "select", options: ["12", "24"] }
                        ]
                    },
                    specifications: {
                        "Switching Capacity": "100mA",
                        "Protection": "IP67"
                    },
                    variants: [
                        { type: "NPN", voltage: "24" },
                        { type: "PNP", voltage: "24" },
                        { type: "2-Wire", voltage: "12" }
                    ]
                },
                {
                    name: "Pneumatic Gripper",
                    slug: "pneumatic-gripper",
                    description: "<h3>Pneumatic Parallel Gripper</h3><p>Precision parallel gripper for automated pick and place applications. Features hardened fingers and adjustable grip force.</p>",
                    variantConfig: {
                        attributes: [
                            { key: "jaw_width", label: "Jaw Opening", unit: "mm", type: "select", options: ["20", "32", "50", "63"] },
                            { key: "grip_force", label: "Grip Force", unit: "N", type: "number" }
                        ]
                    },
                    specifications: {
                        "Operating Pressure": "4-6 bar",
                        "Material": "Aluminum body, hardened steel fingers"
                    },
                    variants: [
                        { jaw_width: "20", grip_force: "50" },
                        { jaw_width: "32", grip_force: "100" },
                        { jaw_width: "50", grip_force: "200" }
                    ]
                }
            ]
        },
        {
            name: "Air Preparation Units",
            slug: "air-preparation-units",
            products: [
                {
                    name: "Air Filter Regulator with Lubricator",
                    slug: "air-filter-regulator-lubricator",
                    description: "<h3>FRL Unit - Filter, Regulator, Lubricator</h3><p>Complete air preparation unit combining filtration, pressure regulation, and lubrication. Essential for pneumatic system protection and optimal performance.</p>",
                    variantConfig: {
                        attributes: [
                            { key: "port_size", label: "Port Size", unit: "inch", type: "select", options: ["1/4", "3/8", "1/2", "3/4", "1"] },
                            { key: "flow_rate", label: "Flow Rate", unit: "LPM", type: "number" }
                        ]
                    },
                    specifications: {
                        "Filtration": "5 micron",
                        "Pressure Range": "0-10 bar",
                        "Bowl Material": "Polycarbonate"
                    },
                    variants: [
                        { port_size: "1/4", flow_rate: "800" },
                        { port_size: "3/8", flow_rate: "1500" },
                        { port_size: "1/2", flow_rate: "3000" }
                    ]
                },
                {
                    name: "Precision Pressure Regulator",
                    slug: "precision-pressure-regulator",
                    description: "<h3>High-Precision Pressure Regulator</h3><p>Industrial-grade precision pressure regulator with fine adjustment and pressure gauge. Maintains stable output pressure.</p>",
                    variantConfig: {
                        attributes: [
                            { key: "port_size", label: "Port Size", unit: "inch", type: "select", options: ["1/4", "3/8", "1/2"] },
                            { key: "pressure_range", label: "Pressure Range", unit: "bar", type: "select", options: ["0-1", "0-4", "0-10"] }
                        ]
                    },
                    specifications: {
                        "Accuracy": "±2%",
                        "Material": "Brass body"
                    },
                    variants: [
                        { port_size: "1/4", pressure_range: "0-4" },
                        { port_size: "3/8", pressure_range: "0-10" },
                        { port_size: "1/2", pressure_range: "0-10" }
                    ]
                }
            ]
        },
        {
            name: "Solenoid & Pneumatic Valves",
            slug: "solenoid-pneumatic-valves",
            products: [
                {
                    name: "5/2 Solenoid Valve",
                    slug: "5-2-solenoid-valve",
                    description: "<h3>5/2 Way Solenoid Valve</h3><p>Industrial solenoid valve with 5 ports and 2 positions for controlling double-acting cylinders. Available in various electrical configurations.</p>",
                    variantConfig: {
                        attributes: [
                            { key: "port_size", label: "Port Size", type: "select", options: ["1/8", "1/4", "3/8", "1/2"] },
                            { key: "voltage", label: "Voltage", unit: "V", type: "select", options: ["24DC", "110AC", "220AC"] },
                            { key: "actuation", label: "Actuation", type: "select", options: ["Single Solenoid", "Double Solenoid"] }
                        ]
                    },
                    specifications: {
                        "Operating Pressure": "2-8 bar",
                        "Response Time": "< 20ms",
                        "Protection": "IP65"
                    },
                    variants: [
                        { port_size: "1/4", voltage: "24DC", actuation: "Single Solenoid" },
                        { port_size: "1/4", voltage: "24DC", actuation: "Double Solenoid" },
                        { port_size: "3/8", voltage: "220AC", actuation: "Single Solenoid" }
                    ]
                },
                {
                    name: "Quick Exhaust Valve",
                    slug: "quick-exhaust-valve",
                    description: "<h3>Quick Exhaust Valve</h3><p>Increases cylinder speed by allowing quick exhaust of air directly to atmosphere, bypassing the control valve.</p>",
                    variantConfig: {
                        attributes: [
                            { key: "port_size", label: "Port Size", type: "select", options: ["1/8", "1/4", "3/8", "1/2"] },
                            { key: "flow_rate", label: "Flow Rate", unit: "LPM", type: "number" }
                        ]
                    },
                    specifications: {
                        "Operating Pressure": "0-10 bar",
                        "Material": "Brass / Aluminum"
                    },
                    variants: [
                        { port_size: "1/8", flow_rate: "200" },
                        { port_size: "1/4", flow_rate: "500" },
                        { port_size: "3/8", flow_rate: "1000" }
                    ]
                }
            ]
        },
        {
            name: "Pneumatic Fittings & Tubes",
            slug: "pneumatic-fittings-tubes",
            products: [
                {
                    name: "PU Pipe",
                    slug: "pu-pipe",
                    description: "<h3>Polyurethane Pneumatic Tubing</h3><p>High-quality PU tubing for pneumatic systems. Flexible, durable, and resistant to abrasion. Available in multiple colors and sizes.</p>",
                    variantConfig: {
                        attributes: [
                            { key: "outer_diameter", label: "Outer Diameter", unit: "mm", type: "select", options: ["4", "6", "8", "10", "12", "16"] },
                            { key: "inner_diameter", label: "Inner Diameter", unit: "mm", type: "select", options: ["2.5", "4", "5", "6.5", "8", "10"] },
                            { key: "color", label: "Color", type: "select", options: ["Blue", "Black", "Red", "Clear", "Orange"] }
                        ]
                    },
                    specifications: {
                        "Material": "Polyurethane",
                        "Working Pressure": "0-10 bar",
                        "Temperature Range": "-20°C to 60°C"
                    },
                    variants: [
                        { outer_diameter: "4", inner_diameter: "2.5", color: "Blue" },
                        { outer_diameter: "6", inner_diameter: "4", color: "Black" },
                        { outer_diameter: "8", inner_diameter: "5", color: "Blue" },
                        { outer_diameter: "10", inner_diameter: "6.5", color: "Blue" },
                        { outer_diameter: "12", inner_diameter: "8", color: "Black" }
                    ]
                },
                {
                    name: "Push In Fittings",
                    slug: "push-in-fittings",
                    description: "<h3>Quick Connect Push-In Fittings</h3><p>One-touch push-in fittings for fast and secure pneumatic connections. No tools required for installation.</p>",
                    variantConfig: {
                        attributes: [
                            { key: "type", label: "Fitting Type", type: "select", options: ["Straight", "Elbow 90°", "Tee", "Y-Connector"] },
                            { key: "tube_od", label: "Tube OD", unit: "mm", type: "select", options: ["4", "6", "8", "10", "12"] },
                            { key: "thread_size", label: "Thread Size", type: "select", options: ["M5", "1/8", "1/4", "3/8", "1/2"] }
                        ]
                    },
                    specifications: {
                        "Material": "Nickel-plated brass",
                        "Working Pressure": "0-10 bar",
                        "Seal": "NBR O-ring"
                    },
                    variants: [
                        { type: "Straight", tube_od: "6", thread_size: "1/4" },
                        { type: "Elbow 90°", tube_od: "8", thread_size: "1/4" },
                        { type: "Tee", tube_od: "6", thread_size: "1/8" },
                        { type: "Y-Connector", tube_od: "8", thread_size: "1/4" }
                    ]
                }
            ]
        },
        {
            name: "Industrial Valves",
            slug: "industrial-valves",
            products: [
                {
                    name: "Three Piece Ball Valve",
                    slug: "three-piece-ball-valve",
                    description: "<h3>3-Piece Ball Valve</h3><p>Heavy-duty stainless steel ball valve with full port design. Suitable for water, oil, gas, and chemical applications.</p>",
                    variantConfig: {
                        attributes: [
                            { key: "size", label: "Size", unit: "inch", type: "select", options: ["1/4", "3/8", "1/2", "3/4", "1", "1-1/4", "1-1/2", "2", "3", "4"] },
                            { key: "material", label: "Material", type: "select", options: ["SS304", "SS316", "Carbon Steel"] },
                            { key: "end_connection", label: "End Connection", type: "select", options: ["Threaded", "Socket Weld", "Butt Weld"] }
                        ]
                    },
                    specifications: {
                        "Pressure Rating": "1000 WOG",
                        "Temperature Range": "-20°C to 180°C",
                        "Operation": "Manual / Actuated"
                    },
                    variants: [
                        { size: "1/2", material: "SS304", end_connection: "Threaded" },
                        { size: "3/4", material: "SS316", end_connection: "Threaded" },
                        { size: "1", material: "SS304", end_connection: "Socket Weld" },
                        { size: "2", material: "SS316", end_connection: "Threaded" }
                    ]
                },
                {
                    name: "Butterfly Valve",
                    slug: "butterfly-valve",
                    description: "<h3>Wafer Type Butterfly Valve</h3><p>Space-saving wafer design butterfly valve for flow control. Available with manual lever or pneumatic actuator.</p>",
                    variantConfig: {
                        attributes: [
                            { key: "size", label: "Size", unit: "inch", type: "select", options: ["2", "3", "4", "6", "8"] },
                            { key: "disc_material", label: "Disc Material", type: "select", options: ["Ductile Iron", "Stainless Steel", "Aluminum Bronze"] },
                            { key: "operator", label: "Operator", type: "select", options: ["Lever", "Gear", "Pneumatic Actuator"] }
                        ]
                    },
                    specifications: {
                        "Pressure Rating": "PN10/PN16",
                        "Seat Material": "EPDM / NBR / Viton"
                    },
                    variants: [
                        { size: "2", disc_material: "Ductile Iron", operator: "Lever" },
                        { size: "4", disc_material: "Stainless Steel", operator: "Gear" },
                        { size: "6", disc_material: "Ductile Iron", operator: "Pneumatic Actuator" }
                    ]
                }
            ]
        },
        {
            name: "Hydraulics & Hoses",
            slug: "hydraulics-hoses",
            products: [
                {
                    name: "Hydraulic Hose Pipe",
                    slug: "hydraulic-hose-pipe",
                    description: "<h3>High-Pressure Hydraulic Hose</h3><p>Flexible hydraulic hose for high-pressure applications. Available from leading brands like Parker, Polyhose, and Aeroflex.</p>",
                    variantConfig: {
                        attributes: [
                            { key: "type", label: "Hose Type", type: "select", options: ["1SN", "2SN", "4SP", "4SH", "R13", "R15"] },
                            { key: "size", label: "Size", unit: "inch", type: "select", options: ["1/4", "3/8", "1/2", "5/8", "3/4", "1", "1-1/4"] },
                            { key: "brand", label: "Brand", type: "select", options: ["Parker", "Polyhose", "Aeroflex", "Gates"] }
                        ]
                    },
                    specifications: {
                        "Construction": "Steel wire braided/spiraled",
                        "Cover": "Synthetic rubber",
                        "Temperature Range": "-40°C to 100°C"
                    },
                    variants: [
                        { type: "1SN", size: "1/4", brand: "Parker" },
                        { type: "2SN", size: "3/8", brand: "Polyhose" },
                        { type: "4SP", size: "1/2", brand: "Aeroflex" },
                        { type: "1SN", size: "5/8", brand: "Gates" }
                    ]
                },
                {
                    name: "PTFE Teflon Hose",
                    slug: "ptfe-teflon-hose",
                    description: "<h3>PTFE/Teflon Hose</h3><p>Chemical-resistant PTFE hose with stainless steel braiding. Ideal for corrosive fluids and high-temperature applications.</p>",
                    variantConfig: {
                        attributes: [
                            { key: "size", label: "Size", unit: "inch", type: "select", options: ["1/4", "3/8", "1/2", "3/4", "1"] },
                            { key: "braiding", label: "Braiding", type: "select", options: ["SS304 Single", "SS316 Single", "SS304 Double"] },
                            { key: "end_fittings", label: "End Fittings", type: "select", options: ["Male NPT", "Female NPT", "JIC", "Flanged"] }
                        ]
                    },
                    specifications: {
                        "Working Pressure": "Up to 3000 PSI",
                        "Temperature Range": "-70°C to 260°C",
                        "Tube Material": "Virgin PTFE"
                    },
                    variants: [
                        { size: "1/4", braiding: "SS304 Single", end_fittings: "Male NPT" },
                        { size: "3/8", braiding: "SS316 Single", end_fittings: "JIC" },
                        { size: "1/2", braiding: "SS304 Double", end_fittings: "Flanged" }
                    ]
                }
            ]
        }
    ]
};

// Helper function to generate media
const generateMedia = async (productName, index = 0) => {
    const publicId = `product_${faker.string.alphanumeric(10)}_${index}`;
    return await Media.create({
        asset_id: `asset_${publicId}`,
        public_id: publicId,
        path: `/products/${publicId}.jpg`,
        thumbnail_url: `https://res.cloudinary.com/demo/image/upload/w_150,h_150,c_fill/products/${publicId}.jpg`,
        secure_url: `https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fill/products/${publicId}.jpg`,
        alt: `${productName} - Image ${index + 1}`,
        title: productName
    });
};

// Seed function
const seedIndustrialCatalog = async () => {
    try {
        console.log('🚀 Starting industrial catalog seeding...\n');
        
        await connectDB();
        
        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await Promise.all([
            ProductVariant.deleteMany({}),
            Product.deleteMany({}),
            Media.deleteMany({}),
            Category.deleteMany({})
        ]);
        console.log('✅ Cleared all existing data\n');
        
        let totalProducts = 0;
        let totalVariants = 0;
        
        // Seed categories and products
        for (const categoryData of catalogData.categories) {
            console.log(`📁 Processing category: ${categoryData.name}`);
            
            // Create category
            const category = await Category.create({
                name: categoryData.name,
                slug: categoryData.slug
            });
            console.log(`   ✓ Created category: ${category.name}`);
            
            // Create products for this category
            for (const productData of categoryData.products) {
                // Generate base price
                const mrp = faker.number.int({ min: 5000, max: 150000 });
                const discount = faker.number.int({ min: 5, max: 25 });
                const sellingPrice = Math.round(mrp - (mrp * discount / 100));
                
                // Create product media (2-4 images)
                const mediaCount = faker.number.int({ min: 2, max: 4 });
                const productMedia = [];
                for (let i = 0; i < mediaCount; i++) {
                    const media = await generateMedia(productData.name, i);
                    productMedia.push(media._id);
                }
                
                // Create product
                const product = await Product.create({
                    name: productData.name,
                    slug: productData.slug,
                    category: category._id,
                    mrp,
                    sellingPrice,
                    discountPercentage: discount,
                    media: productMedia,
                    description: productData.description,
                    variantConfig: productData.variantConfig || {},
                    specifications: productData.specifications || {}
                });
                
                totalProducts++;
                console.log(`      ✓ Created product: ${product.name}`);
                
                // Create variants if specified
                if (productData.variants && productData.variants.length > 0) {
                    for (const variantData of productData.variants) {
                        // Variant pricing (slight variation from base)
                        const variantMrp = Math.round(mrp * faker.number.float({ min: 0.9, max: 1.2 }));
                        const variantDiscount = faker.number.int({ min: 5, max: 25 });
                        const variantSellingPrice = Math.round(variantMrp - (variantMrp * variantDiscount / 100));
                        
                        // Create variant media (1-2 images)
                        const variantMediaCount = faker.number.int({ min: 1, max: 2 });
                        const variantMedia = [];
                        for (let i = 0; i < variantMediaCount; i++) {
                            const media = await generateMedia(`${productData.name} Variant`, i);
                            variantMedia.push(media._id);
                        }
                        
                        // Generate SKU
                        const skuBase = productData.slug.substring(0, 10).toUpperCase().replace(/-/g, '');
                        const skuSuffix = Object.values(variantData).join('-').substring(0, 15).toUpperCase().replace(/[^A-Z0-9]/g, '');
                        const sku = `${skuBase}-${skuSuffix}-${faker.string.alphanumeric(4).toUpperCase()}`;
                        
                        // Convert variant data to Map
                        const attributes = new Map(Object.entries(variantData));
                        
                        await ProductVariant.create({
                            product: product._id,
                            attributes,
                            mrp: variantMrp,
                            sellingPrice: variantSellingPrice,
                            discountPercentage: variantDiscount,
                            sku,
                            stock: faker.number.int({ min: 10, max: 500 }),
                            media: variantMedia
                        });
                        
                        totalVariants++;
                    }
                    console.log(`         ✓ Created ${productData.variants.length} variants`);
                }
            }
            console.log('');
        }
        
        // Create users
        console.log('👥 Creating users...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        try {
            await User.create({
                role: 'admin',
                name: 'Admin User',
                email: 'admin@aircontrol.com',
                password: hashedPassword,
                isEmailVerified: true,
                phone: '+91 9876543210',
                address: 'Mumbai, Maharashtra'
            });
            console.log('   ✓ Created admin user\n');
        } catch (error) {
            if (error.code === 11000) {
                console.log('   ⚠️ Admin user already exists\n');
            } else {
                throw error;
            }
        }
        
        console.log('🎉 Industrial catalog seeding completed!\n');
        console.log('📊 Summary:');
        console.log(`   - Categories: ${catalogData.categories.length}`);
        console.log(`   - Products: ${totalProducts}`);
        console.log(`   - Variants: ${totalVariants}`);
        console.log(`   - Media: ${await Media.countDocuments()}`);
        console.log('\n🔑 Login Credentials:');
        console.log('   Email: admin@aircontrol.com');
        console.log('   Password: admin123');
        
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
    }
};

// Run the seeding script
seedIndustrialCatalog();
