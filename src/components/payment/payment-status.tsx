import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CreditCard, AlertCircle, CheckCircle } from "lucide-react";
import {
  formatCurrency,
  getPaymentStatusColor,
  getPaymentStatusText,
  type PaymentStatus,
} from "@/lib/payment";

interface PaymentStatusProps {
  status: PaymentStatus;
  amount: number;
  paymentUrl?: string;
  className?: string;
  showPayButton?: boolean;
  onPayNow?: () => void;
}

export const PaymentStatusBadge: React.FC<PaymentStatusProps> = ({
  status,
  amount,
  paymentUrl,
  className = "",
  showPayButton = false,
  onPayNow,
}) => {
  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-3 h-3" />;
      case "PAID":
        return <CheckCircle className="w-3 h-3" />;
      case "FAILED":
        return <AlertCircle className="w-3 h-3" />;
      case "EXPIRED":
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const handlePayNow = () => {
    if (paymentUrl) {
      window.open(paymentUrl, "_blank");
    }
    if (onPayNow) {
      onPayNow();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge
        className={`${getPaymentStatusColor(status)} flex items-center gap-1`}
      >
        {getStatusIcon(status)}
        {getPaymentStatusText(status)}
      </Badge>

      <span className="text-sm font-medium">{formatCurrency(amount)}</span>

      {showPayButton && status === "PENDING" && paymentUrl && (
        <Button
          size="sm"
          onClick={handlePayNow}
          className="flex items-center gap-1"
        >
          <CreditCard className="w-3 h-3" />
          Pay Now
        </Button>
      )}
    </div>
  );
};

interface PaymentSummaryProps {
  status: PaymentStatus;
  amount: number;
  paymentUrl?: string;
  orderId?: string;
  expiryDate?: string;
  className?: string;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  status,
  amount,
  paymentUrl,
  orderId,
  expiryDate,
  className = "",
}) => {
  const isPaymentExpired = expiryDate
    ? new Date(expiryDate) < new Date()
    : false;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Payment Status</span>
        <PaymentStatusBadge
          status={status}
          amount={amount}
          paymentUrl={paymentUrl}
          showPayButton={status === "PENDING" && !isPaymentExpired}
        />
      </div>

      {orderId && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Order ID</span>
          <span className="text-xs font-mono">{orderId}</span>
        </div>
      )}

      {expiryDate && status === "PENDING" && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Expires</span>
          <span
            className={`text-xs ${isPaymentExpired ? "text-red-600" : "text-gray-900"}`}
          >
            {new Date(expiryDate).toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};
