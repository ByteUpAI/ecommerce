export async function seedContactUs(SiteConfigModel) {
    console.log('📞 Seeding contact us configuration...');
    
    const contactUsData = {
        contactUs: {
            heading: 'Contact Air Control Industries',
            addressLine1: '15, Dinubhai Estate',
            addressLine2: 'Trikampura Patiya, Gayatri Gathiya',
            city: 'Ahmedabad',
            state: 'Gujarat',
            pincode: '382445',
            country: 'India',
            phone: '80808 15483, 90162 32325',
            email: 'sales@aircontrolindustries.in',
            website: 'www.aircontrolindustries.in',
            mapUrl: 'https://www.google.com/maps/search/?api=1&query=15+Dinubhai+Estate+Trikampura+Patiya+Vatva+GIDC+Ahmedabad+382445',
            workingHours: 'Mon-Sat: 9:00 AM - 6:00 PM',
        }
    };
    
    try {
        const result = await SiteConfigModel.findOneAndUpdate(
            { key: 'contact_us' },
            { $set: { key: 'contact_us', data: contactUsData } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        console.log('✅ Contact us configuration saved successfully');
        return result;
    } catch (error) {
        console.error('❌ Error saving contact us config:', error);
        throw error;
    }
}
