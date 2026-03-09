export const emailLayout = ({
    title,
    bodyHtml,
    config,
    previewText = '',
}) => {
    const company = config?.invoiceCompany || {};
    const logoUrl = config?.invoiceTemplateMedia?.secure_url;

    const companyLine = [company?.name, company?.gstin ? `GSTIN: ${company.gstin}` : '']
        .filter(Boolean)
        .join(' • ');

    const addressLine = [company?.addressLine1, company?.addressLine2].filter(Boolean).join(', ');
    const cityLine = [company?.city, company?.state, company?.pincode].filter(Boolean).join(', ');

    const contactLine = [
        company?.phone ? `Phone: ${company.phone}` : '',
        company?.email ? `Email: ${company.email}` : '',
    ].filter(Boolean).join(' • ');

    const year = new Date().getFullYear();

    return `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title || ''}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${previewText || ''}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f3f4f6;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="640" style="max-width:640px;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
          <tr>
            <td style="padding:22px 24px;background:#111827;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td valign="middle" style="padding-right:12px;">
                    ${logoUrl ? `<img src="${logoUrl}" alt="${company?.name || 'Logo'}" style="display:block;max-width:160px;max-height:44px;width:auto;height:auto;object-fit:contain;" />` : ''}
                  </td>
                  <td valign="middle" align="right" style="color:#ffffff;font-size:12px;line-height:1.4;">
                    ${companyLine ? `<div style="font-weight:700;">${companyLine}</div>` : ''}
                    ${addressLine ? `<div>${addressLine}</div>` : ''}
                    ${cityLine ? `<div>${cityLine}</div>` : ''}
                    ${company?.country ? `<div>${company.country}</div>` : ''}
                    ${contactLine ? `<div style="margin-top:6px;opacity:0.9;">${contactLine}</div>` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:22px 24px 10px;">
              ${title ? `<h1 style="margin:0 0 10px;font-size:18px;line-height:1.25;">${title}</h1>` : ''}
              ${bodyHtml || ''}
            </td>
          </tr>

          <tr>
            <td style="padding:16px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;line-height:1.5;">
              <div>${company?.name ? `${company.name}` : 'Our Company'} • © ${year}</div>
              <div style="margin-top:6px;">If you have any questions, reply to this email ${company?.email ? `or contact us at ${company.email}` : ''}.</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
};
