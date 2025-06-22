import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

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
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Initialize Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Get user from JWT
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Invalid authentication')
    }

    const { formData, successUrl, cancelUrl, existingWebinarRequestId } = await req.json()

    if (!formData) {
      throw new Error('Form data is required')
    }

    let webinarRequest;

    // If upgrading existing webinar, update the existing record
    if (existingWebinarRequestId) {
      const { data: existingRequest, error: fetchError } = await supabaseClient
        .from('webinar_requests')
        .select('*')
        .eq('id', existingWebinarRequestId)
        .eq('user_id', user.id)
        .single()

      if (fetchError || !existingRequest) {
        throw new Error('Webinar request not found or access denied')
      }

      // Update the existing request to pending payment status
      const { data: updatedRequest, error: updateError } = await supabaseClient
        .from('webinar_requests')
        .update({
          payment_status: 'pending',
          form_data: formData, // Update with new form data if needed
        })
        .eq('id', existingWebinarRequestId)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating webinar request:', updateError)
        throw new Error('Failed to update webinar request')
      }

      webinarRequest = updatedRequest
    } else {
      // Create new webinar request record
      const { data: newRequest, error: insertError } = await supabaseClient
        .from('webinar_requests')
        .insert({
          user_id: user.id,
          form_data: formData,
          payment_status: 'pending'
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error creating webinar request:', insertError)
        throw new Error('Failed to create webinar request')
      }

      webinarRequest = newRequest
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: existingWebinarRequestId ? 'Webinar Asset Upgrade' : 'Webinar Asset Generation',
              description: existingWebinarRequestId 
                ? 'Upgrade to full campaign kit with premium assets'
                : 'Generate professional marketing assets from your webinar content',
            },
            unit_amount: 499, // $4.99 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.get('origin')}/upload`,
      metadata: {
        webinar_request_id: webinarRequest.id,
        user_id: user.id,
        is_upgrade: existingWebinarRequestId ? 'true' : 'false',
      },
      customer_email: user.email,
    })

    // Update webinar request with Stripe session ID
    const { error: updateError } = await supabaseClient
      .from('webinar_requests')
      .update({ stripe_session_id: session.id })
      .eq('id', webinarRequest.id)

    if (updateError) {
      console.error('Error updating webinar request:', updateError)
      // Don't throw here as the session is already created
    }

    return new Response(
      JSON.stringify({ 
        sessionId: session.id,
        url: session.url,
        webinarRequestId: webinarRequest.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})