import client from './client.js'

export default {
  async all() {
    return await client.product.findMany()
  }
}
