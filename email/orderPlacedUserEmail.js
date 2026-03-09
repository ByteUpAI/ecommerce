import { emailLayout } from "@/email/emailLayout";
import { getOrderEmailHeadline, getOrderEmailMessage, getOrderStatusLabel } from "@/lib/orderStatusText";

const money = (n) => {
    const num = typeof n === 'number' ? n : Number(n || 0);
    return num.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
};

export const orderPlacedUserEmail = (data) => {
    const status = data?.status || 'pending';
    const statusLabel = getOrderStatusLabel(status);
    const title = getOrderEmailHeadline(status);
    const message = getOrderEmailMessage(status);

    const bodyHtml = `
        <div style="font-size:14px;line-height:1.6;">
            <p style="margin:0 0 12px">Hi${data?.name ? ` ${data.name}` : ''},</p>
            <p style="margin:0 0 14px">${message}</p>

            <div style="border:1px solid #e5e7eb;border-radius:12px;padding:14px;background:#ffffff;">
                <p style="margin:0 0 6px"><b>Order ID:</b> ${data.order_id}</p>
                <p style="margin:0 0 6px"><b>Status:</b> ${statusLabel}</p>
                <p style="margin:0"><b>Total:</b> ${money(data.totalAmount)}</p>
            </div>

            <div style="margin-top:14px;">
                <a href="${data.orderDetailsUrl}" target="_blank" rel="noreferrer" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:10px 14px;border-radius:10px;font-weight:700;font-size:13px;">View order details</a>
                <span style="display:inline-block;width:10px"></span>
                <a href="${data.invoiceUrl}" target="_blank" rel="noreferrer" style="display:inline-block;background:#ffffff;color:#111827;text-decoration:none;padding:10px 14px;border-radius:10px;font-weight:700;font-size:13px;border:1px solid #e5e7eb;">Download invoice</a>
            </div>
        </div>
    `;

    return emailLayout({
        title,
        bodyHtml,
        config: data?.config,
        previewText: `${title} • ${statusLabel} • ${data.order_id}`,
    });
};
