import client from './client.js'

const include = {
	lineItems: {
		orderBy: {
			id: 'asc'
		},
		include: {
			product: true
		}
	}
}

export default {
	async findBy(where) {
		return await client.order.findFirst({
			where,
			include
		})
	},

	async latest() {
		return await this.findBy({ status: { notIn: ['VOID', 'PAID'] } })
	},

	async findOrCreate() {
		let order = await this.latest()

		if (order) return order

		return client.order.create({
			data: {}
		})
	},

	async mark(id, status, data = {}) {
		return await client.order.update({
			where: { id },
			data: { ...data, status }
		})
	}
}
