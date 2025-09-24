import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create demo organization
  const organization = await prisma.organization.upsert({
    where: { id: 'demo-org-1' },
    update: {},
    create: {
      name: 'PAAM Demo Corp',
      type: 'FINTECH',
      registrationNumber: 'DEMO-2024-001',
      taxId: 'TAX-DEMO-001',
      country: 'US',
      complianceLevel: 'STANDARD'
    }
  })

  // Create demo users
  const hashedPassword = await bcrypt.hash('password', 10)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@paam.com' },
    update: {},
    create: {
      email: 'admin@paam.com',
      name: 'PAAM Admin',
      role: 'SUPER_ADMIN',
      organizationId: organization.id
    }
  })

  const complianceUser = await prisma.user.upsert({
    where: { email: 'compliance@paam.com' },
    update: {},
    create: {
      email: 'compliance@paam.com',
      name: 'Compliance Officer',
      role: 'COMPLIANCE_OFFICER',
      organizationId: organization.id
    }
  })

  // Create demo customer
  const customer = await prisma.customer.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      customerId: 'CUST-001',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1990-01-01'),
      nationality: 'US',
      countryOfResidence: 'US',
      riskLevel: 'MEDIUM',
      status: 'ACTIVE',
      organizationId: organization.id
    }
  })

  // Create demo account
  const account = await prisma.account.upsert({
    where: { accountNumber: 'ACC-001' },
    update: {},
    create: {
      customerId: customer.id,
      accountNumber: 'ACC-001',
      accountType: 'CHECKING',
      currency: 'USD',
      balance: 10000,
      availableBalance: 10000,
      status: 'ACTIVE'
    }
  })

  // Create demo SDK versions
  const androidSdk = await prisma.sdkVersion.upsert({
    where: { id: 'android-sdk-1' },
    update: {},
    create: {
      version: 'v2.1.0',
      platform: 'android',
      filename: 'paam-fintech-sdk-android-2.1.0.aar',
      size: '2.4 MB',
      checksum: 'sha256:abc123...',
      downloadUrl: '/download/android/v2.1.0',
      releaseDate: new Date(),
      changelog: 'Added new payment methods and improved KYC flow',
      isActive: true
    }
  })

  const iosSdk = await prisma.sdkVersion.upsert({
    where: { id: 'ios-sdk-1' },
    update: {},
    create: {
      version: 'v2.1.0',
      platform: 'ios',
      filename: 'paam-fintech-sdk-ios-2.1.0.framework',
      size: '1.8 MB',
      checksum: 'sha256:def456...',
      downloadUrl: '/download/ios/v2.1.0',
      releaseDate: new Date(),
      changelog: 'Added Face ID support and enhanced security features',
      isActive: true
    }
  })

  // Create demo API keys
  await prisma.apiKey.upsert({
    where: { id: 'api-key-1' },
    update: {},
    create: {
      userId: adminUser.id,
      key: 'paam_pk_live_51N8z4f2F4h7j9k1m3n5q7s9w1y3b5d7x9z2c4v6b8n0m2k4j6h8g0f1d3s5',
      name: 'Production App',
      isActive: true
    }
  })

  await prisma.apiKey.upsert({
    where: { id: 'api-key-2' },
    update: {},
    create: {
      userId: complianceUser.id,
      key: 'paam_pk_test_51N8z4f2F4h7j9k1m3n5q7s9w1y3b5d7x9z2c4v6b8n0m2k4j6h8g0f1d3s5',
      name: 'Development App',
      isActive: true
    }
  })

  console.log('Database seeded successfully!')
  console.log('Demo users created:')
  console.log('- Admin: admin@paam.com / password')
  console.log('- Compliance: compliance@paam.com / password')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })