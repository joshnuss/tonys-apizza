import client from './client.js'

export default {
  async findBy(where) {
    return await client.product.findUnique({ where })
  }
}
