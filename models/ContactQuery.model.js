import mongoose from "mongoose";

const contactQuerySchema = new mongoose.Schema({
    supportId: {
        type: String,
        required: true,
        unique: true,
        index: true,
        sparse: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    query: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'resolved', 'replied', 'blocked'],
        default: 'pending',
        index: true
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true
    }
}, { timestamps: true })

const ContactQueryModel = mongoose.models.ContactQuery || mongoose.model('ContactQuery', contactQuerySchema, 'contact_queries')
export default ContactQueryModel
