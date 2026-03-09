import { connectDB } from "@/lib/databaseConnection";
import MediaModel from "@/models/Media.model";
import SiteConfigModel from "@/models/SiteConfig.model";

const safeObjectId = (value) => {
    if (!value) return null;
    const s = String(value);
    return s.length === 24 ? s : null;
};

export const SITE_CONFIG_GROUP_KEYS = {
    NOTIFICATIONS: 'notifications',
    INVOICE: 'invoice',
    BANK: 'bank',
    SHIPPING: 'shipping',
    GENERAL: 'general',
    CONTACT_US: 'contact_us',
    TERMS_AND_CONDITIONS: 'terms_and_conditions',
};

export const getSiteConfigGroup = async (key) => {
    await connectDB();

    const doc = await SiteConfigModel.findOne({ key }).sort({ updatedAt: -1, createdAt: -1 }).lean();
    return doc?.data || {};
};

export const setSiteConfigGroup = async (key, data) => {
    await connectDB();

    const doc = await SiteConfigModel.findOneAndUpdate(
        { key },
        { $set: { key, data } },
        { upsert: true, new: true, setDefaultsOnInsert: true, sort: { updatedAt: -1, createdAt: -1 } }
    ).lean();
    return doc?.data || {};
};

export const getMergedSiteConfig = async (opts = {}) => {
    await connectDB();

    const sections = await SiteConfigModel.find({ key: { $in: Object.values(SITE_CONFIG_GROUP_KEYS) } })
        .sort({ updatedAt: -1, createdAt: -1 })
        .lean();
    const sectionMap = new Map((sections || []).map((d) => [d.key, d.data || {}]));

    const notifications = sectionMap.get(SITE_CONFIG_GROUP_KEYS.NOTIFICATIONS) || {};
    const invoice = sectionMap.get(SITE_CONFIG_GROUP_KEYS.INVOICE) || {};
    const bank = sectionMap.get(SITE_CONFIG_GROUP_KEYS.BANK) || {};
    const shipping = sectionMap.get(SITE_CONFIG_GROUP_KEYS.SHIPPING) || {};
    const general = sectionMap.get(SITE_CONFIG_GROUP_KEYS.GENERAL) || {};
    const contactUs = sectionMap.get(SITE_CONFIG_GROUP_KEYS.CONTACT_US) || {};
    const terms = sectionMap.get(SITE_CONFIG_GROUP_KEYS.TERMS_AND_CONDITIONS) || {};

    let legacy = null;
    if (opts?.includeLegacyFallback) {
        legacy = await SiteConfigModel.findOne({ $or: [{ key: null }, { key: { $exists: false } }] })
            .sort({ updatedAt: -1, createdAt: -1 })
            .lean();
    }

    const merged = {
        contactNotificationEmails: notifications.contactNotificationEmails ?? legacy?.contactNotificationEmails ?? [],
        orderNotificationEmails: notifications.orderNotificationEmails ?? legacy?.orderNotificationEmails ?? [],
        sendContactCopyToUser: general.sendContactCopyToUser ?? legacy?.sendContactCopyToUser ?? false,
        invoiceCompany: invoice.invoiceCompany ?? legacy?.invoiceCompany ?? {},
        invoiceTerms: invoice.invoiceTerms ?? legacy?.invoiceTerms ?? '',
        invoiceFooterNote: invoice.invoiceFooterNote ?? legacy?.invoiceFooterNote ?? '',
        bankDetails: bank.bankDetails ?? legacy?.bankDetails ?? {},
        invoiceTemplateMedia: invoice.invoiceTemplateMedia ?? legacy?.invoiceTemplateMedia ?? null,
        shippingLabelTemplateMedia: shipping.shippingLabelTemplateMedia ?? legacy?.shippingLabelTemplateMedia ?? null,
        contactUs: contactUs.contactUs ?? {},
        termsAndConditions: terms.termsAndConditions ?? {},
    };

    if (opts?.populateMedia) {
        const invoiceId = safeObjectId(merged.invoiceTemplateMedia?._id || merged.invoiceTemplateMedia);
        const shippingId = safeObjectId(merged.shippingLabelTemplateMedia?._id || merged.shippingLabelTemplateMedia);

        merged.invoiceTemplateMedia = invoiceId ? await MediaModel.findById(invoiceId).lean() : null;
        merged.shippingLabelTemplateMedia = shippingId ? await MediaModel.findById(shippingId).lean() : null;
    }

    return merged;
};
