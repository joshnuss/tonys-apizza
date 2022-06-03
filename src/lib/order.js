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

export async function capture() {
	await post('/order/capture')
	reset()
}

export async function cancel() {
	await post('/order/void')

	reset()
}

export async function add(sku, quantity) {
	order.set(
		await post('/order', {
			sku, 
			quantity
		})
	)
}

export async function createPaymentIntent() {
  return await post('/stripe/payment-intents')
}
