import app from './app'
import { prisma } from './lib/prisma'

async function main() {
  console.log('Server is running...')
  // You can add more server logic here
  try {
    await prisma.$connect()
    console.log('Connected to the database successfully.')

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is listening on port ${process.env.PORT || 5000}`)
    })
  } catch (error) {
    console.error('Error running server:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}
main()
