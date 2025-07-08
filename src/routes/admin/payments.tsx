import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/data-table"
import { paymentColumns } from "@/components/admin/payment-columns"
import { Search, RefreshCw } from "lucide-react"
import { useState, useEffect } from 'react'
import { toast } from "sonner"
import { getAdminPayments, type PaymentResponse, type GetPaymentsParams } from "@/lib/payment"

export const Route = createFileRoute('/admin/payments')({
  component: PaymentManagement,
})

function PaymentManagement() {
  const [payments, setPayments] = useState<PaymentResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const fetchPayments = async (params?: GetPaymentsParams) => {
    try {
      setLoading(true)
      const response = await getAdminPayments(params)
      setPayments(response.data.payments)
    } catch (error) {
      toast.error("Failed to fetch payments")
      console.error("Error fetching payments:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
  }

  const handleRefresh = () => {
    fetchPayments()
    toast.success("Payments refreshed")
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.booking_id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || payment.payment_status.toLowerCase() === statusFilter.toLowerCase()
    
    return matchesSearch && matchesStatus
  })

  // Status filter component to be used inside column header
  const StatusFilterComponent = () => (
    <Select 
      value={statusFilter} 
      onValueChange={handleStatusFilter}
    >
      <SelectTrigger className="h-8 text-xs w-full">
        <SelectValue placeholder="Filter by Status..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Statuses</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="paid">Paid</SelectItem>
        <SelectItem value="failed">Failed</SelectItem>
        <SelectItem value="expired">Expired</SelectItem>
        <SelectItem value="cancelled">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  )
  
  const columns = paymentColumns(<StatusFilterComponent />)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <p className="text-muted-foreground">Monitor payment transactions and status</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payments</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading payments...</div>
            </div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={filteredPayments}
                showColumnToggle={true}
                initialSorting={[{ id: "created_at", desc: true }]}
              />
              <div className="mt-2 text-sm text-muted-foreground">
                Showing {filteredPayments.length} of {payments.length} payments
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
