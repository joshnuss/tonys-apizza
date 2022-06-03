import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

await db.product.createMany({
  data: [
    {
      sku: 'slice',
      name: 'Slice',
      price: 299
    },
    {
      sku: 'pie',
      name: 'Pie',
      price: 1999
    },
    {
      sku: 'soda',
      name: 'Soda',
      price: 199
    },
    {
      sku: 'water',
      name: 'Water',
      price: 149
    }
  ]
})
