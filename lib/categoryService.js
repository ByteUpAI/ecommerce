import { connectDB } from "@/lib/databaseConnection";
import CategoryModel from "@/models/Category.model";

export async function getCategories() {
    await connectDB();
    const categories = await CategoryModel.find({ deletedAt: null }).populate('image').lean();
    return categories;
}
