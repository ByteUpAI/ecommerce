import { renderToBuffer } from "@react-pdf/renderer";

export const renderPdfResponse = async ({ element, filename }) => {
    const pdfBuffer = await renderToBuffer(element);
    return new Response(pdfBuffer, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${filename}"`,
        }
    });
};
