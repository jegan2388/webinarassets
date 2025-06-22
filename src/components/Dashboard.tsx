import React, { useState, useEffect } from 'react'
import { ArrowLeft, Calendar, Crown, Eye, RefreshCw, Upload, FileText, Clock, CheckCircle, XCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

interface DashboardProps {
  onBack: () => void
  onViewAssets: (webinarRequest: any) => void
  onUpgradeWebinar: (webinarRequest: any) => void
  onRemixAgain: () => void
}

interface WebinarRequest {
  id: string
  form_data: any
  payment_status: 'pending' | 'completed' | 'failed'
  amount_paid: number
  created_at: string
  processed_at: string | null
  assets_json?: any
}

const Dashboard: React.FC<DashboardProps> = ({ 
  onBack, 
  onViewAssets, 
  onUpgradeWebinar, 
  onRemixAgain 
}) => {
  const { user, isProUser } = useAuth()
  const [webinarRequests, setWebinarRequests] = useState<WebinarRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchWebinarRequests()
    }
  }, [user])

  const fetchWebinarRequests = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('webinar_requests')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setWebinarRequests(data || [])
    } catch (err) {
      console.error('Error fetching webinar requests:', err)
      setError('Failed to load your webinars')
    } finally {
      setLoading(false)
    }
  }

  const getWebinarTitle = (formData: any) => {
    if (formData?.file?.name) {
      return formData.file.name.replace(/\.[^/.]+$/, '') // Remove file extension
    }
    if (formData?.description) {
      return formData.description.slice(0, 50) + (formData.description.length > 50 ? '...' : '')
    }
    return 'Untitled Webinar'
  }

  const getStatusInfo = (request: WebinarRequest) => {
    if (request.payment_status === 'pending') {
      return {
        label: 'Payment Pending',
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        icon: <Clock className="w-4 h-4" />
      }
    }
    if (request.payment_status === 'failed') {
      return {
        label: 'Payment Failed',
        color: 'text-red-600 bg-red-50 border-red-200',
        icon: <XCircle className="w-4 h-4" />
      }
    }
    if (request.amount_paid > 0) {
      return {
        label: 'Pro',
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        icon: <Crown className="w-4 h-4" />
      }
    }
    return {
      label: 'Free',
      color: 'text-gray-600 bg-gray-50 border-gray-200',
      icon: <CheckCircle className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-600">Loading your webinars...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to home</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Webinar Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your webinar assets and track your content creation progress
          </p>
          
          {/* User Status */}
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium mt-4 ${
            isProUser 
              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200'
              : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
          }`}>
            {isProUser ? (
              <>
                <Crown className="w-4 h-4" />
                <span>Pro Account - All Features Unlocked</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Free Account - Upgrade Individual Webinars</span>
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <button
            onClick={onRemixAgain}
            className="card p-6 text-left hover:shadow-lg transition-all duration-200 border-2 border-blue-200 bg-blue-50"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Remix New Webinar</h3>
                <p className="text-sm text-gray-600">Upload another webinar to create more assets</p>
              </div>
            </div>
          </button>
          
          <div className="card p-6 bg-gradient-to-r from-mint-50 to-teal-50 border-mint-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-mint-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Webinars</h3>
                <p className="text-2xl font-bold text-mint-600">{webinarRequests.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="card p-6 border-red-200 bg-red-50 mb-8">
            <div className="flex items-center space-x-3">
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900">Error Loading Webinars</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={fetchWebinarRequests}
              className="mt-4 btn-secondary text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Webinar List */}
        {webinarRequests.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No webinars yet
            </h3>
            <p className="text-gray-600 mb-6">
              Upload your first webinar to start creating marketing assets
            </p>
            <button
              onClick={onRemixAgain}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Your First Webinar</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Webinars ({webinarRequests.length})
            </h2>
            
            {webinarRequests.map((request) => {
              const statusInfo = getStatusInfo(request)
              const title = getWebinarTitle(request.form_data)
              const canUpgrade = request.payment_status === 'completed' && request.amount_paid === 0
              const canViewAssets = request.payment_status === 'completed' && request.processed_at
              
              return (
                <div key={request.id} className="card p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                          {statusInfo.icon}
                          <span>{statusInfo.label}</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Uploaded {formatDate(request.created_at)}</span>
                        </div>
                        {request.processed_at && (
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4 text-success-500" />
                            <span>Processed</span>
                          </div>
                        )}
                      </div>
                      
                      {request.form_data?.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {request.form_data.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3 ml-6">
                      {canViewAssets && (
                        <button
                          onClick={() => onViewAssets(request)}
                          className="btn-secondary flex items-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Assets</span>
                        </button>
                      )}
                      
                      {canUpgrade && (
                        <button
                          onClick={() => onUpgradeWebinar(request)}
                          className="btn-primary flex items-center space-x-2"
                        >
                          <Crown className="w-4 h-4" />
                          <span>Upgrade to Pro</span>
                        </button>
                      )}
                      
                      <button
                        onClick={onRemixAgain}
                        className="btn-secondary flex items-center space-x-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Remix Again</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard