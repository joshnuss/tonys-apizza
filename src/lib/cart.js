import { writable } from 'svelte/store'
import { post } from './http'

export let order = writable({
  lineItems: [],
  tax: 0,
  total: 0
})

export function reset() {
  order.set({
    lineItems: [],
    tax: 0,
    total: 0
  })
}

export async function add(sku, quantity = 1) {
  const updated = await post('/order/items', {
    sku,
    quantity
  })

  order.set(updated)
}

export async function createPaymentIntent() {
  return await post('/order/create-payment-intent')
}

export async function capture() {
  await post('/order/capture')
  reset()
}

export async function cancel() {
  await post('/order/cancel')
  reset()
}
