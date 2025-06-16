import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create demo device
  const demoDevice = await prisma.device.upsert({
    where: { id: 'demo-device' },
    update: {},
    create: {
      id: 'demo-device',
      name: 'Lab Sensor Demo',
      location: 'PT. Hervitama Indonesia',
      type: 'ESP32',
      isActive: true,
      lastSeen: new Date(),
    },
  })

  console.log('Created demo device:', demoDevice)

  // Create initial configuration
  const configs = [
    { key: 'tempHigh', value: '28', description: 'High temperature threshold (°C)' },
    { key: 'tempLow', value: '18', description: 'Low temperature threshold (°C)' },
    { key: 'humidityHigh', value: '80', description: 'High humidity threshold (%)' },
    { key: 'humidityLow', value: '30', description: 'Low humidity threshold (%)' },
  ]

  for (const config of configs) {
    await prisma.configuration.upsert({
      where: { key: config.key },
      update: { value: config.value, description: config.description },
      create: config,
    })
  }

  console.log('Created configuration settings')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })