import db from '$lib/db'

export async function get() {
	return {
		body: {
			latestOrder: await db.orders.latest()
		}
	}
}
