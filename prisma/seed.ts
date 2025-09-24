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

  // Create demo users for auth testing
  const demoAdminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Demo Admin',
      role: 'ADMIN',
      organizationId: organization.id
    }
  })

  const demoRegularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Demo User',
      role: 'USER',
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

  // Create demo projects
  const demoProject1 = await prisma.project.upsert({
    where: { id: 'project-1' },
    update: {},
    create: {
      name: 'PAAM Mobile Banking App',
      description: 'A comprehensive mobile banking application with PAAM SDK integration',
      type: 'MOBILE_APP',
      platform: 'android',
      status: 'ACTIVE',
      config: {
        sdkVersion: 'v2.1.0',
        features: ['KYC_VERIFICATION', 'PAYMENT_PROCESSING', 'BIOMETRIC_AUTH'],
        environment: 'production'
      },
      buildSettings: {
        buildTools: 'gradle',
        minSdk: 21,
        targetSdk: 34,
        versionCode: 1,
        versionName: '1.0.0'
      },
      userId: adminUser.id
    }
  })

  const demoProject2 = await prisma.project.upsert({
    where: { id: 'project-2' },
    update: {},
    create: {
      name: 'PAAM iOS FinTech Demo',
      description: 'iOS demo application showcasing PAAM SDK features',
      type: 'MOBILE_APP',
      platform: 'ios',
      status: 'ACTIVE',
      config: {
        sdkVersion: 'v2.1.0',
        features: ['FACE_ID', 'APPLE_PAY', 'KYC_VERIFICATION'],
        environment: 'staging'
      },
      buildSettings: {
        buildTools: 'xcode',
        deploymentTarget: '13.0',
        versionCode: 1,
        versionName: '1.0.0'
      },
      userId: complianceUser.id
    }
  })

  // Create demo builds
  await prisma.build.upsert({
    where: { id: 'build-1' },
    update: {},
    create: {
      projectId: demoProject1.id,
      version: '1.0.0',
      buildNumber: 1,
      status: 'SUCCESS',
      config: {
        buildType: 'release',
        flavor: 'production'
      },
      logs: 'Build completed successfully in 2m 34s',
      artifacts: {
        apk: 'app-release.apk',
        mapping: 'mapping.txt',
        size: '15.2 MB'
      },
      startedAt: new Date(Date.now() - 3600000), // 1 hour ago
      completedAt: new Date(Date.now() - 3600000 + 154000) // 1 hour ago + 2m 34s
    }
  })

  await prisma.build.upsert({
    where: { id: 'build-2' },
    update: {},
    create: {
      projectId: demoProject2.id,
      version: '1.0.0',
      buildNumber: 1,
      status: 'SUCCESS',
      config: {
        buildType: 'release',
        configuration: 'Release'
      },
      logs: 'Build completed successfully in 3m 12s',
      artifacts: {
        ipa: 'PAAM_FinTech_Demo.ipa',
        dSYM: 'PAAM_FinTech_Demo.app.dSYM',
        size: '12.8 MB'
      },
      startedAt: new Date(Date.now() - 7200000), // 2 hours ago
      completedAt: new Date(Date.now() - 7200000 + 192000) // 2 hours ago + 3m 12s
    }
  })

  // Create demo deployments
  await prisma.deployment.upsert({
    where: { id: 'deployment-1' },
    update: {},
    create: {
      projectId: demoProject1.id,
      buildId: 'build-1',
      environment: 'production',
      status: 'SUCCESS',
      config: {
        deploymentType: 'direct',
        target: 'google-play'
      },
      logs: 'Deployment to Google Play Store completed successfully',
      deployedAt: new Date(Date.now() - 1800000) // 30 minutes ago
    }
  })

  await prisma.deployment.upsert({
    where: { id: 'deployment-2' },
    update: {},
    create: {
      projectId: demoProject2.id,
      buildId: 'build-2',
      environment: 'staging',
      status: 'SUCCESS',
      config: {
        deploymentType: 'testflight',
        target: 'beta-testers'
      },
      logs: 'Deployment to TestFlight completed successfully',
      deployedAt: new Date(Date.now() - 900000) // 15 minutes ago
    }
  })

  console.log('Database seeded successfully!')
  console.log('Demo users created:')
  console.log('- Super Admin: admin@paam.com / password')
  console.log('- Compliance: compliance@paam.com / password')
  console.log('- Demo Admin: admin@example.com / admin123')
  console.log('- Demo User: user@example.com / user123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })