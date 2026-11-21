import { jsPDF } from "jspdf";
import { BookingItem } from "@/types";

export function downloadBookingInvoice(booking: BookingItem): void {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.setTextColor(0, 104, 95);
  doc.text("FixMate", 20, 24);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text("Smart Device & Home Appliance Repair Invoice", 20, 31);

  doc.setDrawColor(226, 232, 240);
  doc.line(20, 38, 190, 38);

  doc.setFontSize(11);
  doc.setTextColor(19, 27, 46);
  doc.text(`Booking ID: ${booking._id}`, 20, 48);
  doc.text(
    `Date: ${new Date(booking.createdAt).toLocaleDateString()}`,
    20,
    55
  );
  doc.text(`Payment Status: PAID`, 20, 62);

  doc.setFontSize(12);
  doc.text("Customer Details", 20, 76);
  doc.setFontSize(10);
  doc.setTextColor(61, 73, 71);
  doc.text(`Name: ${booking.customerName}`, 20, 83);
  doc.text(`Email: ${booking.customerEmail}`, 20, 89);
  doc.text(`Phone: ${booking.customerPhone}`, 20, 95);
  doc.text(`Address: ${booking.address}`, 20, 101);

  doc.setFontSize(12);
  doc.setTextColor(19, 27, 46);
  doc.text("Service & Technician", 20, 117);
  doc.setFontSize(10);
  doc.setTextColor(61, 73, 71);
  doc.text(`Service: ${booking.serviceTitle}`, 20, 124);
  doc.text(`Category: ${booking.category}`, 20, 130);
  doc.text(`Technician: ${booking.technicianName}`, 20, 136);

  doc.setDrawColor(226, 232, 240);
  doc.line(20, 146, 190, 146);

  doc.setFontSize(14);
  doc.setTextColor(0, 104, 95);
  doc.text(`Total Paid: $${booking.finalAmount.toFixed(2)} USD`, 20, 158);

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Thank you for choosing FixMate — Pay Only After Completion.",
    20,
    176
  );

  doc.save(`fixmate-invoice-${booking._id.slice(-6)}.pdf`);
}
