import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ExternalLink,
  Clock,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "@tanstack/react-router";
import {
  formatCurrency,
  getPaymentStatusColor,
  getPaymentStatusText,
  type PaymentStatus,
} from "@/lib/payment";

export type PaymentInfo = {
  id: string;
  order_id: string;
  amount: number;
  status: PaymentStatus;
  expiry_date: string;
  payment_url: string;
};

export type BookingInfo = {
  field_name: string;
  location_name: string;
  date: string;
  start_time: string;
  end_time: string;
  duration: number;
  total_price: number;
};

interface PaymentConfirmationProps {
  paymentInfo: PaymentInfo;
  bookingInfo: BookingInfo;
  onClose: () => void;
  onPaymentComplete?: () => void;
}

export const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  paymentInfo,
  bookingInfo,
  onClose,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayNow = () => {
    setIsProcessing(true);
    // Redirect to payment gateway
    window.open(paymentInfo.payment_url, "_blank");

    // Reset processing state after a delay
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "PAID":
        return <CheckCircle className="w-4 h-4" />;
      case "FAILED":
        return <AlertCircle className="w-4 h-4" />;
      case "EXPIRED":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const isPaymentExpired = new Date(paymentInfo.expiry_date) < new Date();
  const timeUntilExpiry =
    new Date(paymentInfo.expiry_date).getTime() - new Date().getTime();
  const minutesUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Confirmation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Payment Status</span>
            <Badge
              className={`${getPaymentStatusColor(paymentInfo.status)} flex items-center gap-1`}
            >
              {getStatusIcon(paymentInfo.status)}
              {getPaymentStatusText(paymentInfo.status)}
            </Badge>
          </div>

          {/* Booking Details */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Booking Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Field:</span>
                <span className="font-medium">{bookingInfo.field_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{bookingInfo.location_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {format(new Date(bookingInfo.date), "PPP")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">
                  {bookingInfo.start_time} - {bookingInfo.end_time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">
                  {bookingInfo.duration} hour(s)
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Details */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Payment Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-xs">
                  {paymentInfo.order_id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium text-lg">
                  {formatCurrency(paymentInfo.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expires:</span>
                <span
                  className={`font-medium ${isPaymentExpired ? "text-red-600" : "text-gray-900"}`}
                >
                  {format(new Date(paymentInfo.expiry_date), "PPp")}
                </span>
              </div>
              {!isPaymentExpired && minutesUntilExpiry > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Time remaining:</span>
                  <span className="font-medium text-orange-600">
                    {minutesUntilExpiry} minute(s)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link
                to="/booking/$bookingId"
                params={{ bookingId: paymentInfo.id }}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Link>
            </Button>
            {paymentInfo.status === "PENDING" && !isPaymentExpired && (
              <Button
                onClick={handlePayNow}
                disabled={isProcessing}
                className="flex-1 flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    Pay Now
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Payment Instructions */}
          {paymentInfo.status === "PENDING" && !isPaymentExpired && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900">
                    Payment Instructions:
                  </p>
                  <p className="text-blue-800 mt-1">
                    Click "Pay Now" to complete your payment. You will be
                    redirected to a secure payment page.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Expired Payment Warning */}
          {isPaymentExpired && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-900">Payment Expired</p>
                  <p className="text-red-800 mt-1">
                    This payment link has expired. Please create a new booking
                    to make a payment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
