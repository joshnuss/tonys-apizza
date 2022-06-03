import db from '$lib/db'

export async function post({ request }) {
  const { sku, quantity = 1 } = await request.json()
  const order = await db.lineItems.upsert({
    sku,
    quantity
  })

  return {
    body: order
  }
}
