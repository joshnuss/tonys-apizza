import { writable } from 'svelte/store'
import { post } from './http'

export let cart = writable({
  lineItems: [],
  tax: 0,
  total: 0
})

export function reset() {
  cart.set({
    lineItems: [],
    tax: 0,
    total: 0
  })
}

export async function add(sku, quantity = 1) {
  const updated = await post('/cart/items', {
    sku,
    quantity
  })

  cart.set(updated)
}

export async function createPaymentIntent() {
  return await post('/cart/create-payment-intent')
}

export async function capture() {
  await post('/cart/capture')
  reset()
}

export async function cancel() {
  await post('/cart/cancel')
  reset()
}
