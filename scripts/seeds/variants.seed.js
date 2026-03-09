import { faker } from '@faker-js/faker';
import { createMedia } from './media.seed.js';

// Variant combinations for each product
const variantCombinations = {
    "dnc-pneumatic-cylinder": [
        { diameter: "32", stroke: "50", mounting: "Foot" },
        { diameter: "40", stroke: "100", mounting: "Foot" },
        { diameter: "50", stroke: "150", mounting: "Flange" },
        { diameter: "63", stroke: "200", mounting: "Foot" },
        { diameter: "80", stroke: "250", mounting: "Trunnion" },
        { diameter: "100", stroke: "300", mounting: "Foot" }
    ],
    "advu-compact-cylinder": [
        { diameter: "16", stroke: "25" },
        { diameter: "20", stroke: "50" },
        { diameter: "25", stroke: "75" },
        { diameter: "32", stroke: "100" },
        { diameter: "40", stroke: "125" }
    ],
    "5-2-solenoid-valve": [
        { port_size: "1/4", voltage: "24DC", actuation: "Single Solenoid" },
        { port_size: "1/4", voltage: "24DC", actuation: "Double Solenoid" },
        { port_size: "3/8", voltage: "220AC", actuation: "Single Solenoid" }
    ],
    "pu-pipe": [
        { outer_diameter: "4", color: "Blue" },
        { outer_diameter: "6", color: "Black" },
        { outer_diameter: "8", color: "Blue" },
        { outer_diameter: "10", color: "Blue" },
        { outer_diameter: "12", color: "Black" }
    ],
    "push-in-fittings": [
        { type: "Straight", tube_od: "6", thread_size: "1/4" },
        { type: "Elbow 90°", tube_od: "8", thread_size: "1/4" },
        { type: "Tee", tube_od: "6", thread_size: "1/8" }
    ],
    "three-piece-ball-valve": [
        { size: "1/2", material: "SS304" },
        { size: "3/4", material: "SS316" },
        { size: "1", material: "SS304" },
        { size: "2", material: "SS316" }
    ]
};

export async function seedProductVariants(ProductVariantModel, MediaModel, products) {
    console.log('🔧 Seeding product variants...');
    
    const variants = [];
    
    for (const product of products) {
        const combinations = variantCombinations[product.slug];
        if (!combinations || combinations.length === 0) continue;
        
        for (const variantData of combinations) {
            // Variant pricing
            const variantMrp = Math.round(product.mrp * faker.number.float({ min: 0.9, max: 1.1 }));
            const variantDiscount = faker.number.int({ min: 5, max: 25 });
            const variantSellingPrice = Math.round(variantMrp - (variantMrp * variantDiscount / 100));
            
            // Create variant media
            const variantMediaCount = faker.number.int({ min: 1, max: 2 });
            const variantMedia = [];
            for (let i = 0; i < variantMediaCount; i++) {
                const media = await createMedia(MediaModel, `${product.name} Variant`, i);
                variantMedia.push(media._id);
            }
            
            // Generate SKU
            const skuBase = product.slug.substring(0, 10).toUpperCase().replace(/-/g, '');
            const skuSuffix = Object.values(variantData).join('-').substring(0, 15).toUpperCase().replace(/[^A-Z0-9]/g, '');
            const sku = `${skuBase}-${skuSuffix}-${faker.string.alphanumeric(4).toUpperCase()}`;
            
            // Convert to Map
            const attributes = new Map(Object.entries(variantData));
            
            const variant = await ProductVariantModel.create({
                product: product._id,
                attributes,
                mrp: variantMrp,
                sellingPrice: variantSellingPrice,
                discountPercentage: variantDiscount,
                sku,
                stock: faker.number.int({ min: 10, max: 500 }),
                media: variantMedia
            });
            
            variants.push(variant);
        }
        
        console.log(`   ✓ Created ${combinations.length} variants for: ${product.name}`);
    }
    
    console.log(`✅ Total variants: ${variants.length}\n`);
    return variants;
}
