import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { getOrderStatusLabel, isPaymentPendingStatus } from "@/lib/orderStatusText";

const formatMoney = (n) => {
    const num = typeof n === 'number' ? n : Number(n || 0);
    const formatted = num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `INR ${formatted}`;
};

const shortenId = (id) => {
    const s = String(id || '');
    if (!s) return '';
    return s.length > 10 ? s.slice(-8) : s;
};

const isPdfUrl = (url) => typeof url === 'string' && /\.pdf(\?|#|$)/i.test(url);

const styles = StyleSheet.create({
    page: { padding: 28, fontSize: 10, fontFamily: 'Helvetica', color: '#111827' },
    header: { border: '1pt solid #D1D5DB', padding: 12, flexDirection: 'row', justifyContent: 'space-between' },
    headerLeft: { flexDirection: 'row', gap: 10, alignItems: 'center' },
    logo: { width: 120, height: 42, objectFit: 'contain' },
    companyName: { fontSize: 12, fontWeight: 700 },
    title: { fontSize: 18, fontWeight: 700, textAlign: 'right' },
    meta: { marginTop: 6, alignItems: 'flex-end' },
    metaRow: { flexDirection: 'row', gap: 6 },
    metaKey: { fontWeight: 700 },

    sectionRow: { marginTop: 12, flexDirection: 'row', gap: 10 },
    box: { flex: 1, border: '1pt solid #D1D5DB', padding: 10 },
    boxTitle: { fontSize: 11, fontWeight: 700, marginBottom: 6 },

    table: { marginTop: 12, border: '1pt solid #D1D5DB' },
    tableHeader: { flexDirection: 'row', borderBottom: '1pt solid #D1D5DB', padding: 8 },
    th: { fontWeight: 700 },
    tr: { flexDirection: 'row', borderBottom: '1pt solid #E5E7EB', padding: 8 },
    colSn: { width: 24 },
    colItem: { flex: 1, paddingRight: 8 },
    colQty: { width: 42 },
    colRate: { width: 80 },
    colAmt: { width: 90 },
    itemName: { fontWeight: 700 },
    itemSub: { fontSize: 8, color: '#4B5563', marginTop: 2 },

    totalsRow: { marginTop: 12, flexDirection: 'row', gap: 10 },
    bankBox: { flex: 1, border: '1pt solid #D1D5DB', padding: 10 },
    totalsBox: { width: 210, border: '1pt solid #D1D5DB', padding: 10 },
    kv: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    kvKey: { fontWeight: 700 },
    kvTotal: { fontWeight: 700, fontSize: 11 },

    termsTitle: { marginTop: 12, fontWeight: 700 },
    footer: { position: 'absolute', left: 28, right: 28, bottom: 18, fontSize: 9, color: '#4B5563' },
});

export default function InvoiceDocument({ order, config }) {
    const company = config?.invoiceCompany || {};
    const bank = config?.bankDetails || {};
    const logoUrl = config?.invoiceTemplateMedia?.secure_url;
    const showLogo = logoUrl && !isPdfUrl(logoUrl);

    const statusLabel = getOrderStatusLabel(order?.status || 'pending');
    const showBank = isPaymentPendingStatus(order?.status);

    const products = Array.isArray(order?.products) ? order.products : [];

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        {showLogo ? <Image src={logoUrl} style={styles.logo} /> : null}
                        <View>
                            <Text style={styles.companyName}>{company?.name || ''}</Text>
                            {company?.addressLine1 || company?.addressLine2 ? (
                                <Text>{[company?.addressLine1, company?.addressLine2].filter(Boolean).join(', ')}</Text>
                            ) : null}
                            {[company?.city, company?.state, company?.pincode].filter(Boolean).length ? (
                                <Text>{[company?.city, company?.state, company?.pincode].filter(Boolean).join(', ')}</Text>
                            ) : null}
                            {company?.country ? <Text>{company.country}</Text> : null}
                        </View>
                    </View>

                    <View>
                        <Text style={styles.title}>INVOICE</Text>
                        <View style={styles.meta}>
                            <View style={styles.metaRow}>
                                <Text style={styles.metaKey}>Order ID:</Text>
                                <Text>{order?.order_id || ''}</Text>
                            </View>
                            <View style={styles.metaRow}>
                                <Text style={styles.metaKey}>Date:</Text>
                                <Text>{order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}</Text>
                            </View>
                            <View style={styles.metaRow}>
                                <Text style={styles.metaKey}>Status:</Text>
                                <Text>{statusLabel}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.sectionRow}>
                    <View style={styles.box}>
                        <Text style={styles.boxTitle}>From</Text>
                        {company?.name ? <Text>{company.name}</Text> : null}
                        {[company?.addressLine1, company?.addressLine2].filter(Boolean).length ? (
                            <Text>{[company?.addressLine1, company?.addressLine2].filter(Boolean).join(', ')}</Text>
                        ) : null}
                        {[company?.city, company?.state, company?.pincode].filter(Boolean).length ? (
                            <Text>{[company?.city, company?.state, company?.pincode].filter(Boolean).join(', ')}</Text>
                        ) : null}
                        {company?.country ? <Text>{company.country}</Text> : null}
                        {company?.phone ? <Text>Phone: {company.phone}</Text> : null}
                        {company?.email ? <Text>Email: {company.email}</Text> : null}
                        {company?.gstin ? <Text>GSTIN: {company.gstin}</Text> : null}
                    </View>

                    <View style={styles.box}>
                        <Text style={styles.boxTitle}>Bill To / Ship To</Text>
                        {order?.name ? <Text>{order.name}</Text> : null}
                        {order?.landmark ? <Text>{order.landmark}</Text> : null}
                        {[order?.city, order?.state, order?.pincode].filter(Boolean).length ? (
                            <Text>{[order?.city, order?.state].filter(Boolean).join(', ')}{order?.pincode ? ` - ${order.pincode}` : ''}</Text>
                        ) : null}
                        {order?.country ? <Text>{order.country}</Text> : null}
                        {order?.phone ? <Text>Phone: {order.phone}</Text> : null}
                        {order?.email ? <Text>Email: {order.email}</Text> : null}
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.colSn, styles.th]}>#</Text>
                        <Text style={[styles.colItem, styles.th]}>Item</Text>
                        <Text style={[styles.colQty, styles.th]}>Qty</Text>
                        <Text style={[styles.colRate, styles.th]}>Rate</Text>
                        <Text style={[styles.colAmt, styles.th]}>Amount</Text>
                    </View>

                    {products.map((p, idx) => {
                        const amount = (Number(p.qty) || 0) * (Number(p.sellingPrice) || 0);
                        return (
                            <View key={`${p.variantId || p.productId || idx}`} style={styles.tr}>
                                <Text style={styles.colSn}>{idx + 1}</Text>
                                <View style={styles.colItem}>
                                    <Text style={styles.itemName}>{p.name || ''}</Text>
                                    <Text style={styles.itemSub}>PID: {shortenId(p.productId)}  VID: {shortenId(p.variantId)}</Text>
                                </View>
                                <Text style={styles.colQty}>{String(p.qty ?? '')}</Text>
                                <Text style={styles.colRate}>{formatMoney(p.sellingPrice)}</Text>
                                <Text style={styles.colAmt}>{formatMoney(amount)}</Text>
                            </View>
                        );
                    })}
                </View>

                <View style={styles.totalsRow}>
                    {showBank ? (
                        <View style={styles.bankBox}>
                            <Text style={styles.boxTitle}>Payment Details</Text>
                            <Text>Please make the payment to the account below.</Text>
                            {bank?.accountName ? <Text>A/C Name: {bank.accountName}</Text> : null}
                            {bank?.accountNumber ? <Text>A/C No: {bank.accountNumber}</Text> : null}
                            {bank?.bankName ? <Text>Bank: {bank.bankName}</Text> : null}
                            {bank?.ifsc ? <Text>IFSC: {bank.ifsc}</Text> : null}
                            {bank?.branch ? <Text>Branch: {bank.branch}</Text> : null}
                            {bank?.upiId ? <Text>UPI: {bank.upiId}</Text> : null}
                        </View>
                    ) : (
                        <View style={styles.bankBox}>
                            <Text style={styles.boxTitle}>Payment</Text>
                            <Text>Payment status: {statusLabel}</Text>
                        </View>
                    )}

                    <View style={styles.totalsBox}>
                        <View style={styles.kv}>
                            <Text style={styles.kvKey}>Subtotal</Text>
                            <Text>{formatMoney(order?.subtotal)}</Text>
                        </View>
                        <View style={styles.kv}>
                            <Text style={styles.kvKey}>Discount</Text>
                            <Text>{formatMoney(order?.discount)}</Text>
                        </View>
                        <View style={styles.kv}>
                            <Text style={styles.kvKey}>Coupon</Text>
                            <Text>{formatMoney(order?.couponDiscountAmount)}</Text>
                        </View>
                        <View style={styles.kv}>
                            <Text style={styles.kvTotal}>Total</Text>
                            <Text style={styles.kvTotal}>{formatMoney(order?.totalAmount)}</Text>
                        </View>
                    </View>
                </View>

                {config?.invoiceTerms ? (
                    <>
                        <Text style={styles.termsTitle}>Terms:</Text>
                        <Text>{String(config.invoiceTerms)}</Text>
                    </>
                ) : null}

                {config?.invoiceFooterNote ? (
                    <Text style={styles.footer}>{String(config.invoiceFooterNote)}</Text>
                ) : null}
            </Page>
        </Document>
    );
}
