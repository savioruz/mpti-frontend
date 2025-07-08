import { API, API_ROUTES, PAYMENT_GATEWAY_CONFIG } from "@/lib/api";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "EXPIRED" | "CANCELLED";

export type PaymentResponse = {
  id: string;
  booking_id: string;
  created_at: string;
  paid_at?: string;
  payment_method: string;
  payment_status: PaymentStatus;
  transaction_id: string;
  updated_at: string;
};

// Payment callback request structure (from API webhook)
export type PaymentCallbackRequest = {
  id: string;
  external_id: string;
  user_id: string;
  is_high: boolean;
  payment_method: string;
  status: string;
  bank_code: string;
  amount: number;
  paid_amount: number;
  paid_at: string;
  payer_email: string;
  description: string;
  created: string;
  updated: string;
  currency: string;
  payment_channel: string;
  payment_destination: string;
  merchant_name: string;
  success_redirect_url: string;
  failed_redirect_url: string;
};

export type PaymentDetails = {
  id: string;
  booking_id: string;
  payment_method: string;
  payment_status: PaymentStatus;
  transaction_id: string;
  created_at: string;
  updated_at: string;
  paid_at?: string;
};

// Get all payments with optional filtering and pagination (Admin endpoint)
export async function getAdminPayments(params?: GetPaymentsParams): Promise<GetPaymentsResponse> {
  const response = await API.get(API_ROUTES.payments.list, { params });
  return response.data;
}

export async function getPaymentByBookingId(bookingId: string): Promise<{ data: PaymentResponse[] }> {
  const response = await API.get(API_ROUTES.payments.byBooking(bookingId));
  return response.data;
}

export async function getPaymentById(paymentId: string): Promise<{ data: PaymentResponse }> {
  const response = await API.get(API_ROUTES.payments.details(paymentId));
  return response.data;
}

export function constructPaymentUrl(transactionId: string): string {
  return `${PAYMENT_GATEWAY_CONFIG.xendit.checkoutUrl}/${transactionId}`;
}

export function redirectToPayment(transactionId: string): void {
  const paymentUrl = constructPaymentUrl(transactionId);
  window.location.href = paymentUrl;
}

export function openPaymentInNewTab(transactionId: string): void {
  const paymentUrl = constructPaymentUrl(transactionId);
  window.open(paymentUrl, '_blank');
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getPaymentStatusColor(status: PaymentStatus): string {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "PAID":
      return "bg-green-100 text-green-800 border-green-300";
    case "FAILED":
      return "bg-red-100 text-red-800 border-red-300";
    case "EXPIRED":
      return "bg-gray-100 text-gray-800 border-gray-300";
    case "CANCELLED":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
}

export function getPaymentStatusText(status: PaymentStatus): string {
  switch (status) {
    case "PENDING":
      return "Pending Payment";
    case "PAID":
      return "Payment Completed";
    case "FAILED":
      return "Payment Failed";
    case "EXPIRED":
      return "Payment Expired";
    case "CANCELLED":
      return "Payment Cancelled";
    default:
      return "Unknown Status";
  }
}

export type GetPaymentsResponse = {
  data: {
    payments: PaymentResponse[];
    total_items: number;
    total_pages: number;
  };
};

export type GetPaymentsParams = {
  payment_method?: string;
  payment_status?: string;
  page?: number;
  limit?: number;
};
