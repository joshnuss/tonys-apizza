import db from '$lib/db'

export async function post() {
  const { id: orderId } = await db.orders.findOrCreate()
  const order = await db.orders.mark(orderId, 'VOID')

  return {
    body: order
  }
}
