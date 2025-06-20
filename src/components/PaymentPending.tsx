import React, { useEffect, useState } from 'react'
import { CreditCard, Loader2, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import { checkPaymentStatus, subscribeToPaymentUpdates } from '../lib/stripe'

interface PaymentPendingProps {
  webinarRequestId: string
  onPaymentSuccess: (formData: any) => void
  onPaymentFailed: () => void
  onBack: () => void
}

const PaymentPending: React.FC<PaymentPendingProps> = ({
  webinarRequestId,
  onPaymentSuccess,
  onPaymentFailed,
  onBack
}) => {
  const [status, setStatus] = useState<'checking' | 'pending' | 'completed' | 'failed'>('checking')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let channel: any = null

    const checkStatus = async () => {
      try {
        const request = await checkPaymentStatus(webinarRequestId)
        
        if (request.payment_status === 'completed') {
          setStatus('completed')
          setTimeout(() => {
            onPaymentSuccess(request.form_data)
          }, 2000)
        } else if (request.payment_status === 'failed') {
          setStatus('failed')
          setError('Payment failed. Please try again.')
        } else {
          setStatus('pending')
          
          // Subscribe to real-time updates
          channel = subscribeToPaymentUpdates(webinarRequestId, (payload) => {
            const updatedRequest = payload.new
            
            if (updatedRequest.payment_status === 'completed') {
              setStatus('completed')
              setTimeout(() => {
                onPaymentSuccess(updatedRequest.form_data)
              }, 2000)
            } else if (updatedRequest.payment_status === 'failed') {
              setStatus('failed')
              setError('Payment failed. Please try again.')
            }
          })

          // Only subscribe if the channel is not already joined
          if (channel.state !== 'joined') {
            channel.subscribe()
          }
        }
      } catch (err) {
        console.error('Error checking payment status:', err)
        setError(err instanceof Error ? err.message : 'Failed to check payment status')
        setStatus('failed')
      }
    }

    checkStatus()

    return () => {
      if (channel) {
        channel.unsubscribe()
      }
    }
  }, [webinarRequestId, onPaymentSuccess])

  const handleRetry = () => {
    if (status === 'failed') {
      onPaymentFailed()
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to upload</span>
        </button>

        <div className="card p-8 text-center">
          {status === 'checking' && (
            <>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Checking Payment Status...
              </h1>
              <p className="text-gray-600">
                Please wait while we verify your payment.
              </p>
            </>
          )}

          {status === 'pending' && (
            <>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Waiting for Payment Confirmation
              </h1>
              <p className="text-gray-600 mb-6">
                Please complete your payment in the Stripe checkout window. 
                This page will automatically update once payment is confirmed.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Monitoring payment status...</span>
              </div>
            </>
          )}

          {status === 'completed' && (
            <>
              <div className="w-16 h-16 bg-gradient-to-r from-success-500 to-mint-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Payment Successful! 🎉
              </h1>
              <p className="text-gray-600 mb-6">
                Your payment has been confirmed. Starting asset generation now...
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-success-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Redirecting to processing...</span>
              </div>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Payment Failed
              </h1>
              <p className="text-gray-600 mb-6">
                {error || 'There was an issue processing your payment. Please try again.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleRetry}
                  className="btn-primary"
                >
                  Try Again
                </button>
                <button
                  onClick={onBack}
                  className="btn-secondary"
                >
                  Back to Upload
                </button>
              </div>
            </>
          )}
        </div>

        {/* Payment Info */}
        <div className="card p-6 mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            What You're Getting
          </h3>
          <div className="text-sm text-blue-800 space-y-1">
            <div>• Professional marketing assets from your webinar</div>
            <div>• LinkedIn posts, sales emails, and more</div>
            <div>• Brand-styled quote cards and visuals</div>
            <div>• One-time payment of $4.99</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPending