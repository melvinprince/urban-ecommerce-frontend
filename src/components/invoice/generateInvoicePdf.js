import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";

/**
 * @param {object} order - Full order object
 */
export async function generateInvoicePdf(order) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();
  const margin = 50;
  let y = height - margin;

  const drawText = (text, x = margin, options = {}) => {
    const fontSize = options.size || 12;
    const color = options.color || rgb(0, 0, 0);
    page.drawText(text, { x, y, size: fontSize, font, color });
    y -= fontSize + 6;
  };

  drawText(`Invoice - Order #${order.customOrderId}`, margin, { size: 16 });

  drawText("Customer Details:");
  drawText(`${order.address.fullName}`);
  drawText(`${order.address.email} | ${order.address.phone}`);
  drawText(`${order.address.street}, ${order.address.city}`);
  drawText(`${order.address.postalCode}, ${order.address.country}`);

  y -= 10;
  drawText("Order Summary:", margin, { size: 14 });

  order.items.forEach((item) => {
    drawText(
      `• ${item.product.title} - Qty: ${item.quantity} × ${item.price.toFixed(
        2
      )} QAR`
    );
  });

  drawText(`Total: ${order.totalAmount.toFixed(2)} QAR`, margin, {
    size: 13,
  });
  drawText(`Payment Method: ${order.paymentMethod}`);
  drawText(`Status: ${order.isPaid ? "Paid" : "Pending"}`);

  // Add QR code
  const qrUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/track-order?id=${order.customOrderId}`;
  const qrDataUrl = await QRCode.toDataURL(qrUrl);
  const qrImageBytes = await fetch(qrDataUrl).then((res) => res.arrayBuffer());
  const qrImage = await pdfDoc.embedPng(qrImageBytes);
  const qrDims = qrImage.scale(0.25);
  page.drawImage(qrImage, {
    x: width - qrDims.width - margin,
    y: margin,
    width: qrDims.width,
    height: qrDims.height,
  });

  const pdfBytes = await pdfDoc.save();

  // Trigger download
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice-${order.customOrderId}.pdf`;
  link.click();
}
