import { connectDB } from "@/lib/databaseConnection";
import ProductModel from "@/models/Product.model";

export async function getFeaturedProducts(limit = 8) {
    await connectDB();
    const products = await ProductModel.find({ deletedAt: null })
        .populate('media')
        .limit(limit)
        .lean();
    return products;
}
