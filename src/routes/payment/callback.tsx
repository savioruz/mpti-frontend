import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/payment/callback')({
  component: PaymentCallback,
})

function PaymentCallback() {
  useEffect(() => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const status = urlParams.get('status')

    // Handle different payment statuses
    if (status === 'success') {
      toast.success('Payment completed successfully!')
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)
    } else if (status === 'failed') {
      toast.error('Payment failed. Please try again.')
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)
    } else if (status === 'pending') {
      toast.info('Payment is being processed.')
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Processing Payment
          </h2>
          <p className="text-gray-600">
            Please wait while we process your payment...
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
          
          <p className="text-sm text-gray-500">
            You will be redirected automatically...
          </p>
        </div>
      </div>
    </div>
  )
}
