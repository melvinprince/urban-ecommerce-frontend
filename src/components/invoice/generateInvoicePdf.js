// import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
// import QRCode from "qrcode";
//
// /**
//  * @param {object} order - Full order object
//  */
// export async function generateInvoicePdf(order) {
//   const pdfDoc = await PDFDocument.create();
//   const page = pdfDoc.addPage([595, 842]); // A4 size
//   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//
//   const { width, height } = page.getSize();
//   const margin = 50;
//   let y = height - margin;
//
//   const drawText = (text, x = margin, options = {}) => {
//     const fontSize = options.size || 12;
//     const color = options.color || rgb(0, 0, 0);
//     page.drawText(text, { x, y, size: fontSize, font, color });
//     y -= fontSize + 6;
//   };
//
//   drawText(`Invoice - Order #${order.customOrderId}`, margin, { size: 16 });
//
//   drawText("Customer Details:");
//   drawText(`${order.address.fullName}`);
//   drawText(`${order.address.email} | ${order.address.phone}`);
//   drawText(`${order.address.street}, ${order.address.city}`);
//   drawText(`${order.address.postalCode}, ${order.address.country}`);
//
//   y -= 10;
//   drawText("Order Summary:", margin, { size: 14 });
//
//   order.items.forEach((item) => {
//     drawText(
//       `• ${item.product.title} - Qty: ${item.quantity} × ${item.price.toFixed(
//         2
//       )} QAR`
//     );
//   });
//
//   drawText(`Total: ${order.totalAmount.toFixed(2)} QAR`, margin, {
//     size: 13,
//   });
//   drawText(`Payment Method: ${order.paymentMethod}`);
//   drawText(`Status: ${order.isPaid ? "Paid" : "Pending"}`);
//
//   // Add QR code
//   const qrUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/track-order?id=${order.customOrderId}`;
//   const qrDataUrl = await QRCode.toDataURL(qrUrl);
//   const qrImageBytes = await fetch(qrDataUrl).then((res) => res.arrayBuffer());
//   const qrImage = await pdfDoc.embedPng(qrImageBytes);
//   const qrDims = qrImage.scale(0.25);
//   page.drawImage(qrImage, {
//     x: width - qrDims.width - margin,
//     y: margin,
//     width: qrDims.width,
//     height: qrDims.height,
//   });
//
//   const pdfBytes = await pdfDoc.save();
//
//   // Trigger download
//   const blob = new Blob([pdfBytes], { type: "application/pdf" });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.download = `invoice-${order.customOrderId}.pdf`;
//   link.click();
// }

/**
 * generateInvoicePdf(order)
 * -----------------------------------
 * • A4-portrait, multi-page support
 * • Re-usable header + footer on every page
 * • Automatic table pagination
 * • Large QR on last page
 * • Consistent professional layout (logo, colours, fonts, page numbers)
 *
 * Dependencies
 *   npm i pdf-lib qrcode
 */
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";

/* A4 portrait ------------------------------------------------------------ */
const PAGE_W = 595;
const PAGE_H = 842;
const MARGIN_T = 50;
const MARGIN_B = 70;

const ROW_H = 20;
const HEADER_H = 24;

const LINE = rgb(0.8, 0.8, 0.8);
const BG_HDR = rgb(0.95, 0.95, 0.95);

/* ----------------------------------------------------------------------- */
export async function generateInvoicePdf(order) {
  /* 0. document & fonts */
  const pdf = await PDFDocument.create();
  const fontR = await pdf.embedFont(StandardFonts.Helvetica);
  const fontB = await pdf.embedFont(StandardFonts.HelveticaBold);

  /* 1. one-time logo load (optional) */
  const tryLoadLogo = async () => {
    try {
      const url =
        (typeof window !== "undefined"
          ? window.location.origin
          : process.env.NEXT_PUBLIC_FRONTEND_URL) +
        "/brandData/URBAN-logo-transparent.png";
      const res = await fetch(url);
      if (!res.ok || !res.headers.get("Content-Type")?.includes("png"))
        return null;
      const img = await pdf.embedPng(await res.arrayBuffer());
      return { img, dims: img.scale(0.6) };
    } catch {
      return null;
    }
  };
  const logo = await tryLoadLogo();

  /* 2. header / footer helpers */
  const drawHeader = (page, pageNo) => {
    let y = PAGE_H - MARGIN_T;

    if (logo) {
      page.drawImage(logo.img, {
        x: MARGIN_T,
        y: y - logo.dims.height,
        width: logo.dims.width,
        height: logo.dims.height,
      });
      y -= logo.dims.height + 15;
    } else {
      y -= 30;
    }

    const ttl = "INVOICE";
    const ttlSize = 24;
    page.drawText(ttl, {
      x: (PAGE_W - fontB.widthOfTextAtSize(ttl, ttlSize)) / 2,
      y,
      size: ttlSize,
      font: fontB,
      color: rgb(0.1, 0.5, 0.3),
    });

    page.drawLine({
      start: { x: MARGIN_T, y: y - 10 },
      end: { x: PAGE_W - MARGIN_T, y: y - 10 },
      thickness: 1,
      color: LINE,
    });

    return y - 30; // new baseline
  };

  const drawFooter = (page, pageNo, total) => {
    page.drawLine({
      start: { x: MARGIN_T, y: MARGIN_B },
      end: { x: PAGE_W - MARGIN_T, y: MARGIN_B },
      thickness: 0.8,
      color: LINE,
    });
    const text = `Page ${pageNo} of ${total}`;
    const fSize = 10;
    page.drawText(text, {
      x: PAGE_W / 2 - fontR.widthOfTextAtSize(text, fSize) / 2,
      y: MARGIN_B - 18,
      size: fSize,
      font: fontR,
      color: rgb(0.4, 0.4, 0.4),
    });
    const slogan = "Thank you for shopping with Urban E-commerce!";
    page.drawText(slogan, {
      x: PAGE_W / 2 - fontR.widthOfTextAtSize(slogan, fSize) / 2,
      y: MARGIN_B - 32,
      size: fSize,
      font: fontR,
      color: rgb(0.5, 0.5, 0.5),
    });
  };

  /* 3. util: new page */
  const pages = [];
  const newPage = () => {
    const p = pdf.addPage([PAGE_W, PAGE_H]);
    pages.push(p);
    return p;
  };

  /* 4. start … */
  let page = newPage();
  let y = drawHeader(page, 1);

  /* 5. customer box (first page) */
  const C_BOX_H = 95;
  page.drawRectangle({
    x: MARGIN_T,
    y: y - C_BOX_H,
    width: PAGE_W - 2 * MARGIN_T,
    height: C_BOX_H,
    borderWidth: 1,
    borderColor: LINE,
    color: rgb(1, 1, 1),
  });
  page.drawText("Customer Details:", {
    x: MARGIN_T + 12,
    y: y - 18,
    size: 14,
    font: fontB,
    color: rgb(0.1, 0.1, 0.1),
  });
  const lines = [
    order.address.fullName,
    `${order.address.email} | ${order.address.phone}`,
    `${order.address.street}, ${order.address.city}`,
    `${order.address.postalCode}, ${order.address.country}`,
  ];
  let ty = y - 38;
  lines.forEach((l) => {
    page.drawText(l, { x: MARGIN_T + 12, y: ty, size: 12, font: fontR });
    ty -= 16;
  });
  y -= C_BOX_H + 30;

  /* 6. table header builder */
  const colX = (() => {
    const w = PAGE_W - 2 * MARGIN_T;
    return [
      MARGIN_T,
      MARGIN_T + w * 0.55,
      MARGIN_T + w * 0.55 + w * 0.1,
      MARGIN_T + w * 0.55 + w * 0.1 + w * 0.17,
    ];
  })();

  const drawTableHeader = (pg, yy) => {
    pg.drawRectangle({
      x: MARGIN_T,
      y: yy - HEADER_H + 4,
      width: PAGE_W - 2 * MARGIN_T,
      height: HEADER_H,
      color: BG_HDR,
      borderColor: LINE,
      borderWidth: 0.8,
    });
    ["Item", "Qty", "Unit Price", "Total"].forEach((t, i) => {
      pg.drawText(t, {
        x: colX[i] + 4,
        y: yy - 15,
        size: 12,
        font: fontB,
      });
    });
    return yy - HEADER_H - 4;
  };

  page.drawText("Order Summary:", {
    x: MARGIN_T,
    y,
    size: 16,
    font: fontB,
    color: rgb(0.15, 0.15, 0.15),
  });
  y -= 24;
  y = drawTableHeader(page, y);

  /* 7. rows with pagination */
  const addRow = (it) => {
    if (y - ROW_H < MARGIN_B + 50) {
      page = newPage();
      y = drawHeader(page, pages.length);
      page.drawText("Order Summary (cont.):", {
        x: MARGIN_T,
        y,
        size: 16,
        font: fontB,
      });
      y -= 24;
      y = drawTableHeader(page, y);
    }

    const rowY = y - 15;
    const text = (s) => (s.length > 40 ? s.slice(0, 37) + "…" : s);
    page.drawText(text(it.product.title), {
      x: colX[0] + 4,
      y: rowY,
      size: 12,
      font: fontR,
    });
    page.drawText(String(it.quantity), {
      x: colX[1] + 8,
      y: rowY,
      size: 12,
      font: fontR,
    });
    page.drawText(it.price.toFixed(2), {
      x: colX[2] + 8,
      y: rowY,
      size: 12,
      font: fontR,
    });
    page.drawText((it.price * it.quantity).toFixed(2), {
      x: colX[3] + 8,
      y: rowY,
      size: 12,
      font: fontR,
    });

    page.drawLine({
      start: { x: MARGIN_T, y: y - ROW_H + 4 },
      end: { x: PAGE_W - MARGIN_T, y: y - ROW_H + 4 },
      thickness: 0.5,
      color: LINE,
    });

    y -= ROW_H;
  };

  order.items.forEach(addRow);

  /* 8. totals / payment block */
  if (y - 100 < MARGIN_B) {
    page = newPage();
    y = drawHeader(page, pages.length);
  }
  const TBOX_H = 60;
  page.drawRectangle({
    x: MARGIN_T,
    y: y - TBOX_H,
    width: PAGE_W - 2 * MARGIN_T,
    height: TBOX_H,
    color: BG_HDR,
    borderColor: LINE,
    borderWidth: 1,
  });
  page.drawText("Total:", {
    x: PAGE_W - MARGIN_T - 170,
    y: y - 22,
    size: 16,
    font: fontB,
  });
  page.drawText(order.totalAmount.toFixed(2) + " QAR", {
    x: PAGE_W - MARGIN_T - 90,
    y: y - 22,
    size: 16,
    font: fontB,
  });
  y -= TBOX_H + 30;

  page.drawText(`Payment Method: ${order.paymentMethod.toUpperCase()}`, {
    x: MARGIN_T,
    y,
    size: 13,
    font: fontR,
  });
  y -= 18;
  page.drawText(`Payment Status: ${order.isPaid ? "Paid" : "Pending"}`, {
    x: MARGIN_T,
    y,
    size: 13,
    font: fontR,
    color: order.isPaid ? rgb(0, 0.6, 0) : rgb(0.8, 0, 0),
  });

  /* 9. QR on last page */
  const url =
    (typeof window !== "undefined" && window.location.href) ||
    `${process.env.NEXT_PUBLIC_FRONTEND_URL}/order/confirmation?id=${order.customOrderId}`;
  const qrData = await QRCode.toDataURL(url);
  const qrImg = await pdf.embedPng(await (await fetch(qrData)).arrayBuffer());
  const qr = qrImg.scale(0.4);
  pages.at(-1).drawImage(qrImg, {
    x: PAGE_W - qr.width - MARGIN_T,
    y: MARGIN_B,
    width: qr.width,
    height: qr.height,
  });

  /* 10. footers */
  pages.forEach((p, i) => drawFooter(p, i + 1, pages.length));

  /* 11. download */
  const bytes = await pdf.save();
  const blob = new Blob([bytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `invoice-${order.customOrderId}.pdf`;
  link.click();
}
