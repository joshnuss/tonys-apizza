import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY)

export async function post() {
  const token = await stripe.terminal.connectionTokens.create()

  return {
    body: {
      secret: token.secret
    }
  }
}
