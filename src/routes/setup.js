import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY)

export async function get() {
  const { data } = await stripe.terminal.locations.list()

  return { body: { locations: data} }
}