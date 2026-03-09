import { emailLayout } from "@/email/emailLayout";
import { getOrderStatusLabel } from "@/lib/orderStatusText";

const money = (n) => {
    const num = typeof n === 'number' ? n : Number(n || 0);
    return num.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
};

export const orderPlacedAdminEmail = (data) => {
    const o = data.order || {};
    const products = Array.isArray(o.products) ? o.products : [];

    const rows = products.map((p) => {
        const total = (Number(p.qty) || 0) * (Number(p.sellingPrice) || 0);
        return `
            <tr>
                <td style="padding:8px;border-bottom:1px solid #eee">${p.name}</td>
                <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${p.qty}</td>
                <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${money(p.sellingPrice)}</td>
                <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${money(total)}</td>
            </tr>
        `;
    }).join('');

    const statusLabel = getOrderStatusLabel(o.status || 'pending');

    const bodyHtml = `
        <div style="font-size:14px;line-height:1.6;">
            <p style="margin:0 0 12px"><b>Order ID:</b> ${data.order_id}</p>
            <p style="margin:0 0 12px"><b>Status:</b> ${statusLabel}</p>

            <h3 style="margin:16px 0 8px">Customer</h3>
            <p style="margin:0">${o.name}</p>
            <p style="margin:0">${o.email}</p>
            <p style="margin:0 0 12px">${o.phone}</p>

            <h3 style="margin:16px 0 8px">Shipping Address</h3>
            <p style="margin:0">${o.landmark}</p>
            <p style="margin:0">${o.city}, ${o.state} - ${o.pincode}</p>
            <p style="margin:0 0 12px">${o.country}</p>

            <h3 style="margin:16px 0 8px">Items</h3>
            <table style="width:100%;border-collapse:collapse">
                <thead>
                    <tr>
                        <th style="padding:8px;border-bottom:2px solid #000;text-align:left">Item</th>
                        <th style="padding:8px;border-bottom:2px solid #000;text-align:center">Qty</th>
                        <th style="padding:8px;border-bottom:2px solid #000;text-align:right">Price</th>
                        <th style="padding:8px;border-bottom:2px solid #000;text-align:right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>

            <h3 style="margin:16px 0 8px">Totals</h3>
            <p style="margin:0"><b>Subtotal:</b> ${money(o.subtotal)}</p>
            <p style="margin:0"><b>Discount:</b> ${money(o.discount)}</p>
            <p style="margin:0"><b>Coupon Discount:</b> ${money(o.couponDiscountAmount)}</p>
            <p style="margin:0"><b>Total:</b> ${money(o.totalAmount)}</p>

            <p style="margin:16px 0 0"><a href="${data.orderDetailsUrl}" target="_blank" rel="noreferrer">View order details</a></p>
            <p style="margin:0"><a href="${data.invoiceUrl}" target="_blank" rel="noreferrer">Download invoice (PDF)</a></p>
        </div>
    `;

    return emailLayout({
        title: 'New order received',
        bodyHtml,
        config: data?.config,
        previewText: `New order received • ${data.order_id}`,
    });
};
