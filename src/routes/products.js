import db from '$lib/db'

export async function get() {
  return {
    body: await db.products.all()
  }
}
