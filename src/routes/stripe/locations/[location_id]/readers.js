import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY)

export async function get({ params }) {
  const locationId = params.location_id
  const { data } = await stripe.terminal.readers.list({ location: locationId })

  return { body: data }
}