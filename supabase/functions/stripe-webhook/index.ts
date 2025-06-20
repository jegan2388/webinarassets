import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      throw new Error('No Stripe signature found')
    }

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    if (!webhookSecret) {
      throw new Error('Stripe webhook secret not configured')
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response('Webhook signature verification failed', { status: 400 })
    }

    console.log('Received webhook event:', event.type)

    // Handle the checkout session completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      const webinarRequestId = session.metadata?.webinar_request_id
      const userId = session.metadata?.user_id

      if (!webinarRequestId || !userId) {
        console.error('Missing metadata in webhook:', session.metadata)
        return new Response('Missing required metadata', { status: 400 })
      }

      console.log('Processing payment for webinar request:', webinarRequestId)

      // Update webinar request status
      const { error: updateError } = await supabaseClient
        .from('webinar_requests')
        .update({
          payment_status: 'completed',
          amount_paid: session.amount_total || 499,
          updated_at: new Date().toISOString()
        })
        .eq('id', webinarRequestId)
        .eq('user_id', userId)

      if (updateError) {
        console.error('Error updating webinar request:', updateError)
        return new Response('Failed to update webinar request', { status: 500 })
      }

      // Increment user's webinars processed count
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .update({
          webinars_processed_count: supabaseClient.rpc('increment_webinars_count', { user_id: userId })
        })
        .eq('id', userId)

      if (profileError) {
        console.error('Error updating profile:', profileError)
        // Don't fail the webhook for this, just log it
      }

      console.log('Payment processed successfully for webinar request:', webinarRequestId)
    }

    // Handle failed payments
    if (event.type === 'checkout.session.expired' || event.type === 'payment_intent.payment_failed') {
      const session = event.data.object as Stripe.Checkout.Session

      const webinarRequestId = session.metadata?.webinar_request_id

      if (webinarRequestId) {
        const { error: updateError } = await supabaseClient
          .from('webinar_requests')
          .update({
            payment_status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('id', webinarRequestId)

        if (updateError) {
          console.error('Error updating failed payment:', updateError)
        }
      }
    }

    return new Response('Webhook processed successfully', { 
      status: 200,
      headers: corsHeaders 
    })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response(`Webhook error: ${error.message}`, { 
      status: 400,
      headers: corsHeaders 
    })
  }
})