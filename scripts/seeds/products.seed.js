import { faker } from '@faker-js/faker';
import { createMedia } from './media.seed.js';

export const productsData = {
    "pneumatic-cylinders": [
        {
            name: "DNC Pneumatic Cylinder",
            slug: "dnc-pneumatic-cylinder",
            description: "<h3>ISO Standard DNC Cylinder</h3><p>High-performance ISO standard pneumatic cylinder for industrial automation applications.</p><h4>Features:</h4><ul><li>ISO 15552 compliant</li><li>Double-acting operation</li><li>Magnetic piston</li><li>Hardened piston rod</li></ul>",
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
                "Material": "Aluminum alloy"
            }
        },
        {
            name: "ADVU Compact Cylinder",
            slug: "advu-compact-cylinder",
            description: "<h3>Compact Pneumatic Cylinder</h3><p>Space-saving design ideal for limited installation space.</p><h4>Features:</h4><ul><li>Compact design</li><li>Double-acting</li><li>Integrated sensor groove</li></ul>",
            variantConfig: {
                attributes: [
                    { key: "diameter", label: "Bore Diameter", unit: "mm", type: "select", options: ["16", "20", "25", "32", "40", "50", "63"] },
                    { key: "stroke", label: "Stroke Length", unit: "mm", type: "number" }
                ]
            },
            specifications: {
                "Operating Pressure": "1-10 bar",
                "Material": "Aluminum alloy"
            }
        }
    ],
    "solenoid-pneumatic-valves": [
        {
            name: "5/2 Solenoid Valve",
            slug: "5-2-solenoid-valve",
            description: "<h3>5/2 Way Solenoid Valve</h3><p>Industrial solenoid valve for controlling double-acting cylinders.</p>",
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
            }
        }
    ],
    "pneumatic-fittings-tubes": [
        {
            name: "PU Pipe",
            slug: "pu-pipe",
            description: "<h3>Polyurethane Pneumatic Tubing</h3><p>Flexible, durable PU tubing for pneumatic systems.</p>",
            variantConfig: {
                attributes: [
                    { key: "outer_diameter", label: "Outer Diameter", unit: "mm", type: "select", options: ["4", "6", "8", "10", "12"] },
                    { key: "color", label: "Color", type: "select", options: ["Blue", "Black", "Red", "Clear"] }
                ]
            },
            specifications: {
                "Material": "Polyurethane",
                "Working Pressure": "0-10 bar"
            }
        },
        {
            name: "Push In Fittings",
            slug: "push-in-fittings",
            description: "<h3>Quick Connect Push-In Fittings</h3><p>One-touch fittings for fast pneumatic connections.</p>",
            variantConfig: {
                attributes: [
                    { key: "type", label: "Fitting Type", type: "select", options: ["Straight", "Elbow 90°", "Tee"] },
                    { key: "tube_od", label: "Tube OD", unit: "mm", type: "select", options: ["6", "8", "10", "12"] },
                    { key: "thread_size", label: "Thread Size", type: "select", options: ["1/8", "1/4", "3/8"] }
                ]
            },
            specifications: {
                "Material": "Nickel-plated brass",
                "Working Pressure": "0-10 bar"
            }
        }
    ],
    "industrial-valves": [
        {
            name: "Three Piece Ball Valve",
            slug: "three-piece-ball-valve",
            description: "<h3>3-Piece Ball Valve</h3><p>Heavy-duty stainless steel ball valve.</p>",
            variantConfig: {
                attributes: [
                    { key: "size", label: "Size", unit: "inch", type: "select", options: ["1/2", "3/4", "1", "2"] },
                    { key: "material", label: "Material", type: "select", options: ["SS304", "SS316"] }
                ]
            },
            specifications: {
                "Pressure Rating": "1000 WOG",
                "Temperature Range": "-20°C to 180°C"
            }
        }
    ]
};

export async function seedProducts(ProductModel, MediaModel, categories) {
    console.log('📦 Seeding products...');
    
    const products = [];
    const categoryMap = new Map(categories.map(cat => [cat.slug, cat]));
    
    for (const [categorySlug, productsArray] of Object.entries(productsData)) {
        const category = categoryMap.get(categorySlug);
        if (!category) continue;
        
        for (const productData of productsArray) {
            const mrp = faker.number.int({ min: 5000, max: 100000 });
            const discount = faker.number.int({ min: 5, max: 25 });
            const sellingPrice = Math.round(mrp - (mrp * discount / 100));
            
            // Create product media
            const mediaCount = faker.number.int({ min: 2, max: 4 });
            const productMedia = [];
            for (let i = 0; i < mediaCount; i++) {
                const media = await createMedia(MediaModel, productData.name, i);
                productMedia.push(media._id);
            }
            
            const product = await ProductModel.create({
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
            
            products.push(product);
            console.log(`   ✓ Created: ${product.name}`);
        }
    }
    
    console.log(`✅ Total products: ${products.length}\n`);
    return products;
}
