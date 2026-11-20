export type UserRole = "customer" | "technician" | "admin";

export type ServiceCategory =
  | "Smartphone"
  | "Laptop & PC"
  | "AC"
  | "Refrigerator"
  | "TV"
  | "Washing Machine"
  | "Electrical";

export type ServiceMode = "Home Visit" | "Shop Drop-off";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type BookingStatus =
  | "requested"
  | "accepted"
  | "rejected"
  | "in-progress"
  | "completed"
  | "cancelled";
export type PaymentStatus = "unpaid" | "paid";

export interface UserProfile {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  phone?: string;
  area?: string;
  bio?: string;
  createdAt?: string;
}

export interface ServiceReview {
  customerName: string;
  rating: number;
  review: string;
  reviewedAt: string;
}

export interface ServiceItem {
  _id: string;
  title: string;
  category: ServiceCategory;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: ServiceMode;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: ApprovalStatus;
  isAvailable: boolean;
  createdAt: string;
  averageRating?: number;
  reviewCount?: number;
  technician?: {
    name: string;
    email: string;
    image?: string;
    area?: string;
    bio?: string;
  };
  reviews?: ServiceReview[];
}

export interface StatusHistoryItem {
  status: BookingStatus | "paid";
  changedAt: string;
}

export interface BookingItem {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: ServiceCategory;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status: BookingStatus;
  finalAmount: number;
  paymentStatus: PaymentStatus;
  statusHistory?: StatusHistoryItem[];
  rating?: number;
  review?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface PaymentItem {
  _id: string;
  bookingId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: "paid";
  paidAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
