import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    if (!sig) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        
        if (userId) {
          // Update user to Plus plan
          await supabase
            .from('profiles')
            .update({
              plan: 'plus',
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);
          
          console.log(`User ${userId} upgraded to Plus plan`);
        }
        break;

      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Find user by stripe customer ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();
        
        if (profile) {
          // Update subscription status
          const plan = subscription.status === 'active' ? 'plus' : 'free';
          await supabase
            .from('profiles')
            .update({
              plan,
              updated_at: new Date().toISOString(),
            })
            .eq('id', profile.id);
          
          console.log(`User ${profile.id} subscription updated to ${plan}`);
        }
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        const deletedCustomerId = deletedSubscription.customer as string;
        
        // Find user by stripe customer ID
        const { data: deletedProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', deletedCustomerId)
          .single();
        
        if (deletedProfile) {
          // Downgrade to free plan
          await supabase
            .from('profiles')
            .update({
              plan: 'free',
              stripe_subscription_id: null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', deletedProfile.id);
          
          console.log(`User ${deletedProfile.id} downgraded to free plan`);
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
