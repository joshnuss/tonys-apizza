import client from './client.js'
import orders from './orders.js'
import products from './products.js'

const TAX_RATE = parseFloat(process.env.TAX_RATE || '0')

export default {
  async upsert({ sku, quantity }) {
    const { id: orderId } = await orders.findOrCreate()
    const { id: productId, price, taxable } = await products.findBy({ sku })
    const tax = taxable ? (price * quantity * TAX_RATE) : 0

    await client.$transaction([
      upsertItem({ orderId, productId, quantity, price }),
      incrementTotals({ orderId, quantity, price, tax })
    ])

    return orders.findBy({ id: orderId })
  }
}

function upsertItem({ orderId, productId, quantity, price }) {
  return client.lineItem.upsert({
    where: {
      orderId_productId: {
        orderId,
        productId
      }
    },
    create: {
      orderId,
      productId,
      quantity,
      price,
      subtotal: price * quantity
    },
    update: {
      quantity: {
        increment: quantity
      },
      subtotal: {
        increment: price * quantity
      }
    }
  })
}

function incrementTotals({ orderId, price, quantity, tax }) {
  return client.order.update({
    where: { id: orderId },
    data: {
      subtotal: {
        increment: price * quantity
      },
      total: {
        increment: (price * quantity) + parseInt(tax)
      },
      tax: {
        increment: parseInt(tax)
      }
    }
  })
}
