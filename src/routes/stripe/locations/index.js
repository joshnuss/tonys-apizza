import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY)

export async function post() {
}