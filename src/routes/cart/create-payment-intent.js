import db from '$lib/db'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY)

export async function post() {
  let order = await db.orders.findOrCreate()

  const paymentIntent = await stripe.paymentIntents.create({
    amount: order.total,
    currency: 'usd',
    payment_method_types: ['card_present'],
    capture_method: 'manual'
  })

  await db.orders.mark(order.id, 'PROCESSING_PAYMENT', { paymentIntentId: paymentIntent.id })

  return {
    body: paymentIntent
  }
}
