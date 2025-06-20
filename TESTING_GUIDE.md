# Stripe Payment Testing Guide

## Prerequisites Checklist

Before testing, ensure you have:

- ✅ Stripe account in **Test Mode**
- ✅ Webhook endpoint created and configured
- ✅ Webhook secret added to Supabase Edge Function secrets
- ✅ Stripe secret key added to Supabase Edge Function secrets
- ✅ Supabase environment variables configured in your `.env` file

## Test Payment Flow

### 1. Test with Stripe Test Cards

Use these test card numbers (they won't charge real money):

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/25`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

**Declined Payment:**
- Card: `4000 0000 0000 0002`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

### 2. Testing Steps

1. **Start the Application**
   ```bash
   npm run dev
   ```

2. **Create an Account**
   - Go to your app
   - Click "Sign In" and create a new account
   - Verify you're logged in

3. **Upload a Webinar**
   - Click "Upload Your Webinar"
   - Fill out the form:
     - Upload a small audio/video file
     - Add description, persona, funnel stage
     - Select at least one asset type
   - Click "Pay $4.99 & Generate Assets"

4. **Complete Test Payment**
   - You should be redirected to Stripe Checkout
   - Use the test card `4242 4242 4242 4242`
   - Complete the payment form
   - Click "Pay"

5. **Verify Payment Success**
   - You should be redirected back to your app
   - The payment pending page should show "Payment Successful!"
   - You should then be redirected to the processing page

## Debugging Common Issues

### Issue 1: "Failed to create checkout session"

**Check:**
- Supabase Edge Function secrets are set correctly
- User is authenticated (signed in)
- Network tab shows the request to `/functions/v1/create-checkout-session`

**Fix:**
```bash
# Check Supabase secrets
supabase secrets list

# Should show:
# STRIPE_SECRET_KEY
# STRIPE_WEBHOOK_SECRET
```

### Issue 2: Webhook not receiving events

**Check:**
- Webhook endpoint URL is correct: `https://your-project.supabase.co/functions/v1/stripe-webhook`
- Webhook is listening for: `checkout.session.completed`, `checkout.session.expired`, `payment_intent.payment_failed`
- Webhook secret matches what's in Supabase

**Test webhook manually:**
1. Go to Stripe Dashboard > Developers > Webhooks
2. Click on your webhook endpoint
3. Click "Send test webhook"
4. Select `checkout.session.completed`
5. Check if it shows as successful

### Issue 3: Payment status not updating

**Check:**
- Database permissions (RLS policies)
- Supabase real-time subscriptions are working
- Check browser console for errors

**Debug:**
```sql
-- Check webinar_requests table
SELECT * FROM webinar_requests ORDER BY created_at DESC LIMIT 5;

-- Check if payment status updated
SELECT id, payment_status, stripe_session_id, created_at 
FROM webinar_requests 
WHERE payment_status = 'completed';
```

## Manual Testing Checklist

### ✅ Authentication Flow
- [ ] User can sign up
- [ ] User can sign in
- [ ] User stays logged in after page refresh

### ✅ Upload Form
- [ ] Form validation works
- [ ] File upload works
- [ ] All required fields are enforced
- [ ] Asset selection works

### ✅ Payment Flow
- [ ] Checkout session creates successfully
- [ ] Redirects to Stripe Checkout
- [ ] Test payment completes
- [ ] Redirects back to app
- [ ] Payment status updates in database

### ✅ Webhook Processing
- [ ] Webhook receives events
- [ ] Database updates correctly
- [ ] User's webinar count increments

### ✅ Error Handling
- [ ] Declined payment shows error
- [ ] Network errors are handled gracefully
- [ ] User can retry failed payments

## Monitoring Tools

### 1. Stripe Dashboard
- **Payments:** See all test payments
- **Webhooks:** Monitor webhook delivery
- **Logs:** Check for any errors

### 2. Supabase Dashboard
- **Database:** Check `webinar_requests` table
- **Edge Functions:** Monitor function logs
- **Real-time:** Verify subscriptions

### 3. Browser DevTools
- **Network tab:** Check API requests
- **Console:** Look for JavaScript errors
- **Application tab:** Check local storage/session

## Test Scenarios

### Scenario 1: Happy Path
1. User signs up → Success
2. User uploads webinar → Success  
3. User pays → Success
4. Processing starts → Success

### Scenario 2: Payment Failure
1. User uploads webinar → Success
2. User tries to pay with declined card → Failure
3. User sees error message → Success
4. User can retry → Success

### Scenario 3: Webhook Delay
1. User pays → Success
2. Webhook is delayed → Payment pending shows
3. Webhook processes → Status updates
4. User proceeds to processing → Success

## Production Readiness

Before going live:

- [ ] Switch Stripe to Live Mode
- [ ] Update webhook endpoint to production URL
- [ ] Test with real (small amount) payment
- [ ] Set up monitoring and alerts
- [ ] Test error scenarios thoroughly

## Getting Help

If you encounter issues:

1. **Check Supabase Edge Function logs**
2. **Check Stripe webhook delivery logs**
3. **Verify all environment variables**
4. **Test each component individually**

Remember: All test payments use fake money and won't charge real cards!