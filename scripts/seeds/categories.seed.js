export const categoriesData = [
    {
        name: "Pneumatic Cylinders",
        slug: "pneumatic-cylinders"
    },
    {
        name: "Cylinder Mountings & Accessories",
        slug: "cylinder-mountings-accessories"
    },
    {
        name: "Air Preparation Units",
        slug: "air-preparation-units"
    },
    {
        name: "Solenoid & Pneumatic Valves",
        slug: "solenoid-pneumatic-valves"
    },
    {
        name: "Pneumatic Fittings & Tubes",
        slug: "pneumatic-fittings-tubes"
    },
    {
        name: "Brass Fittings & Valves",
        slug: "brass-fittings-valves"
    },
    {
        name: "Industrial Valves",
        slug: "industrial-valves"
    },
    {
        name: "Hydraulics & Hoses",
        slug: "hydraulics-hoses"
    }
];

export async function seedCategories(CategoryModel) {
    console.log('📁 Seeding categories...');
    const categories = [];
    
    for (const categoryData of categoriesData) {
        try {
            const category = await CategoryModel.create(categoryData);
            categories.push(category);
            console.log(`   ✓ Created: ${category.name}`);
        } catch (error) {
            if (error.code === 11000) {
                const existing = await CategoryModel.findOne({ slug: categoryData.slug });
                categories.push(existing);
                console.log(`   ⚠️ Already exists: ${categoryData.name}`);
            } else {
                throw error;
            }
        }
    }
    
    console.log(`✅ Total categories: ${categories.length}\n`);
    return categories;
}
