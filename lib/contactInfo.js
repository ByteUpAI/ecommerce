const hasContent = (value) => typeof value === 'string' && value.trim().length > 0

export const FALLBACK_CONTACT_INFO = {
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
  workingHours: 'Mon-Sat: 9:00 AM - 6:00 PM',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=15+Dinubhai+Estate+Trikampura+Patiya+Vatva+GIDC+Ahmedabad+382445',
}

export const normalizeContactInfo = (data) => {
  const hasConfiguredData = Object.values(data || {}).some(hasContent)

  if (!hasConfiguredData) {
    return { info: FALLBACK_CONTACT_INFO, isConfigured: false }
  }

  return {
    info: {
      ...FALLBACK_CONTACT_INFO,
      ...data,
    },
    isConfigured: true,
  }
}

export const splitPhones = (phoneString) =>
  String(phoneString || '')
    .split(',')
    .map((phone) => phone.trim())
    .filter(Boolean)

export const formatWebsiteUrl = (website) => {
  if (!hasContent(website)) return ''
  return website.startsWith('http') ? website : `https://${website}`
}
