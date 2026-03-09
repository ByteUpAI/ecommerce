import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    email: { type: String },
    designation: { type: String },
    company: { type: String },
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media'
    }
}, { timestamps: true });

if (mongoose.models.Testimonial) {
    delete mongoose.models.Testimonial;
}

const TestimonialModel = mongoose.model('Testimonial', testimonialSchema);
export default TestimonialModel;
