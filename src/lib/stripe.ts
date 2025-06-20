import { supabase } from './supabase'

export interface CheckoutSessionResponse {
  sessionId: string
  url: string
  webinarRequestId: string
}

export const createCheckoutSession = async (
  formData: any,
  successUrl?: string,
  cancelUrl?: string
): Promise<CheckoutSessionResponse> => {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.access_token) {
    throw new Error('User not authenticated')
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  if (!supabaseUrl) {
    throw new Error('Supabase URL not configured')
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      formData,
      successUrl,
      cancelUrl,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `HTTP ${response.status}: Failed to create checkout session`)
  }

  return await response.json()
}

export const checkPaymentStatus = async (webinarRequestId: string) => {
  const { data, error } = await supabase
    .from('webinar_requests')
    .select('*')
    .eq('id', webinarRequestId)
    .single()

  if (error) {
    throw new Error(`Failed to check payment status: ${error.message}`)
  }

  return data
}

export const subscribeToPaymentUpdates = (
  webinarRequestId: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel(`webinar_request_${webinarRequestId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'webinar_requests',
        filter: `id=eq.${webinarRequestId}`,
      },
      callback
    )
    .subscribe()
}