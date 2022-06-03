import client from './client.js'
import orders from './orders.js'

export default {
  async create({ sku, quantity }) {
    const { id: orderId } = await orders.findOrCreate()
    const { id: productId, price } = await client.product.findUnique({
      where: { sku }
    })

    await client.$transaction([
      upsertLineItem({ orderId, productId, quantity, price }),
      incrementTotals({ orderId, quantity, price })
    ])

    return orders.findBy({ id: orderId })
  }
}

function upsertLineItem({ orderId, productId, quantity, price }) {
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

function incrementTotals({ orderId, price, quantity }) {
  return client.order.update({
    where: { id: orderId },
    data: {
      subtotal: {
        increment: price * quantity
      },
      total: {
        increment: price * quantity
      }
    }
  })
}
