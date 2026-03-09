import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const isPdfUrl = (url) => typeof url === 'string' && /\.pdf(\?|#|$)/i.test(url);

const styles = StyleSheet.create({
    page: { padding: 28, fontSize: 12, fontFamily: 'Helvetica', color: '#111827' },
    header: { border: '1pt solid #D1D5DB', padding: 12, flexDirection: 'row', justifyContent: 'space-between' },
    headerLeft: { flexDirection: 'row', gap: 10, alignItems: 'center' },
    logo: { width: 120, height: 42, objectFit: 'contain' },
    title: { fontSize: 18, fontWeight: 700, textAlign: 'right' },
    companyName: { fontSize: 11, fontWeight: 700 },

    box: { marginTop: 12, border: '1pt solid #D1D5DB', padding: 12 },
    row: { flexDirection: 'row', gap: 12 },
    col: { flex: 1 },
    label: { fontSize: 11, fontWeight: 700, marginBottom: 6 },
    small: { fontSize: 10, color: '#4B5563' },
    footer: { position: 'absolute', left: 28, right: 28, bottom: 18, fontSize: 9, color: '#4B5563' },
});

export default function ShippingLabelDocument({ order, config }) {
    const company = config?.invoiceCompany || {};
    const logoUrl = config?.shippingLabelTemplateMedia?.secure_url;
    const showLogo = logoUrl && !isPdfUrl(logoUrl);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        {showLogo ? <Image src={logoUrl} style={styles.logo} /> : null}
                        <View>
                            {company?.name ? <Text style={styles.companyName}>{company.name}</Text> : null}
                            {[company?.addressLine1, company?.addressLine2].filter(Boolean).length ? (
                                <Text style={styles.small}>{[company?.addressLine1, company?.addressLine2].filter(Boolean).join(', ')}</Text>
                            ) : null}
                        </View>
                    </View>
                    <View>
                        <Text style={styles.title}>SHIPPING LABEL</Text>
                        {order?.order_id ? <Text style={styles.small}>Order ID: {order.order_id}</Text> : null}
                    </View>
                </View>

                <View style={styles.box}>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.label}>From</Text>
                            {company?.name ? <Text>{company.name}</Text> : null}
                            {[company?.city, company?.state, company?.pincode].filter(Boolean).length ? (
                                <Text>{[company?.city, company?.state].filter(Boolean).join(', ')}{company?.pincode ? ` - ${company.pincode}` : ''}</Text>
                            ) : null}
                            {company?.country ? <Text>{company.country}</Text> : null}
                            {company?.phone ? <Text>Phone: {company.phone}</Text> : null}
                        </View>

                        <View style={styles.col}>
                            <Text style={styles.label}>Ship To</Text>
                            {order?.name ? <Text>{order.name}</Text> : null}
                            {order?.landmark ? <Text>{order.landmark}</Text> : null}
                            {[order?.city, order?.state, order?.pincode].filter(Boolean).length ? (
                                <Text>{[order?.city, order?.state].filter(Boolean).join(', ')}{order?.pincode ? ` - ${order.pincode}` : ''}</Text>
                            ) : null}
                            {order?.country ? <Text>{order.country}</Text> : null}
                            {order?.phone ? <Text>Phone: {order.phone}</Text> : null}
                        </View>
                    </View>
                </View>

                <Text style={styles.footer}>Handle with care. Keep dry.</Text>
            </Page>
        </Document>
    );
}
