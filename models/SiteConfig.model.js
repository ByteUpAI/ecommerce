import mongoose from "mongoose";

const siteConfigSchema = new mongoose.Schema({
    key: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },

    data: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },

    contactNotificationEmails: {
        type: [String],
        default: [],
    },
    orderNotificationEmails: {
        type: [String],
        default: [],
    },
    invoiceCompany: {
        name: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        gstin: { type: String, default: '' },
        addressLine1: { type: String, default: '' },
        addressLine2: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        pincode: { type: String, default: '' },
        country: { type: String, default: '' },
    },
    bankDetails: {
        accountName: { type: String, default: '' },
        accountNumber: { type: String, default: '' },
        bankName: { type: String, default: '' },
        ifsc: { type: String, default: '' },
        branch: { type: String, default: '' },
        upiId: { type: String, default: '' },
    },
    invoiceTerms: {
        type: String,
        default: '',
        trim: true,
    },
    invoiceFooterNote: {
        type: String,
        default: '',
        trim: true,
    },
    invoiceTemplateMedia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
        default: null,
    },
    shippingLabelTemplateMedia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
        default: null,
    },
    sendContactCopyToUser: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true })

siteConfigSchema.index({ key: 1 }, { unique: true, sparse: true });

if (mongoose.models.SiteConfig) {
    delete mongoose.models.SiteConfig;
}

const SiteConfigModel = mongoose.model('SiteConfig', siteConfigSchema, 'site_configs')
export default SiteConfigModel
