import { loadStripeTerminal } from '@stripe/terminal-js'
import { writable } from 'svelte/store'
import { order, createPaymentIntent, capture } from '$lib/cart'
import { post } from '$lib/http'

let terminal = null

export async function initTerminal() {
  const StripeTerminal = await loadStripeTerminal()

  terminal = StripeTerminal.create({
    onFetchConnectionToken,
    onUnexpectedReaderDisconnect,
    onConnectionStatusChange({ status }) {
      console.log(`connection status changed ${status}`)
    },
    onPaymentStatusChange({ status }) {
      console.log(`payment status changed ${status}`)
    }
  })

  const { discoveredReaders } = await terminal.discoverReaders({ simulated: true })
  terminal.connectReader(discoveredReaders[0])

  order.subscribe($order => {
    terminal.setReaderDisplay({
      type: 'cart',
      cart: {
        line_items: $order.lineItems.map((line) => ({
          description: line.product.name,
          quantity: line.quantity,
          amount: line.subtotal
        })),
        tax: $order.tax,
        total: $order.total,
        currency: 'usd'
      }
    })
  })
}

export async function pay() {
  const paymentIntent = await createPaymentIntent()

  let result = await terminal.collectPaymentMethod(paymentIntent.client_secret)

  if (result.error) {
    paying = false
    console.error(result.error)
  }

  result = await terminal.processPayment(result.paymentIntent)

  if (result.error) {
    paying = false
    console.error(result.error)
  }

  await capture()
}

async function onFetchConnectionToken() {
  const token = await post('/stripe/connection-token')
  return token.secret
}

function onUnexpectedReaderDisconnect() {
  console.error('reader disconnected')
}

