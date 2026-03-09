import mongoose from "mongoose";

const siteConfigGroupSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
}, { timestamps: true })

if (mongoose.models.SiteConfigGroup) {
    delete mongoose.models.SiteConfigGroup;
}

const SiteConfigGroupModel = mongoose.model('SiteConfigGroup', siteConfigGroupSchema, 'site_config_groups')
export default SiteConfigGroupModel
