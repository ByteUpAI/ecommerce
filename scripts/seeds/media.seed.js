import { faker } from '@faker-js/faker';

export async function createMedia(MediaModel, name, index = 0) {
    const publicId = `${faker.string.alphanumeric(10)}_${index}`;
    return await MediaModel.create({
        asset_id: `asset_${publicId}`,
        public_id: publicId,
        path: `/products/${publicId}.jpg`,
        thumbnail_url: `https://res.cloudinary.com/demo/image/upload/w_150,h_150,c_fill/products/${publicId}.jpg`,
        secure_url: `https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fill/products/${publicId}.jpg`,
        alt: `${name} - Image ${index + 1}`,
        title: name
    });
}
