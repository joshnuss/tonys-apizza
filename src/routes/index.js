import db from '$lib/db'

export async function get() {
  return {
    body: {
      openOrder: await db.orders.latest()
    }
  }
}
