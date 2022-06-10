import db from '$lib/db'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function post() {
  let order = await db.orders.findOrCreate()

  if (!order.paymentIntentId) {
    return {
      status: 406
    }
  }

  await stripe.paymentIntents.capture(order.paymentIntentId)
  order = await db.orders.mark(order.id, 'PAID')

  return {
    body: order
  }
}
