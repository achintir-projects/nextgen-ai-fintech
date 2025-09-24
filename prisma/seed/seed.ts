import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create SDK versions
  const androidSdk = await prisma.sdkVersion.upsert({
    where: {
      version_platform: {
        version: '2.1.0',
        platform: 'android'
      }
    },
    update: {},
    create: {
      version: '2.1.0',
      platform: 'android',
      filename: 'paam-fintech-sdk-android-2.1.0.aar',
      size: '2.4 MB',
      checksum: 'sha256:abc123def4567890abcdef1234567890abcdef1234567890abcdef1234567890',
      downloadUrl: 'https://cdn.paam.com/sdk/android/paam-fintech-sdk-android-2.1.0.aar',
      releaseDate: new Date('2024-01-15'),
      changelog: JSON.stringify([
        'Added enhanced biometric authentication',
        'Improved payment processing performance',
        'Fixed memory leak in KYC verification',
        'Added support for new document types'
      ])
    }
  })

  const iosSdk = await prisma.sdkVersion.upsert({
    where: {
      version_platform: {
        version: '2.1.0',
        platform: 'ios'
      }
    },
    update: {},
    create: {
      version: '2.1.0',
      platform: 'ios',
      filename: 'PAAMFinTechSDK-2.1.0.xcframework',
      size: '1.8 MB',
      checksum: 'sha256:def456abc1237890def456abc1237890def456abc1237890def456abc1237890',
      downloadUrl: 'https://cdn.paam.com/sdk/ios/PAAMFinTechSDK-2.1.0.xcframework',
      releaseDate: new Date('2024-01-15'),
      changelog: JSON.stringify([
        'Added Face ID and Touch ID support',
        'Integrated Apple Pay processing',
        'Enhanced KYC verification UI',
        'Improved offline mode functionality'
      ])
    }
  })

  // Create documentation
  const quickStartDocs = await prisma.documentation.createMany({
    data: [
      {
        title: 'Android Quick Start',
        content: `# Android Quick Start Guide

## 1. Add Dependencies

Add the following to your app's build.gradle file:

\`\`\`gradle
dependencies {
    implementation 'com.paam:fintech-sdk:2.1.0'
}
\`\`\`

## 2. Update Permissions

Add these permissions to your AndroidManifest.xml:

\`\`\`xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
\`\`\`

## 3. Initialize SDK

Initialize the SDK in your Application class:

\`\`\`kotlin
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        PAAMSDK.initialize(
            context = this,
            apiKey = "your-api-key",
            environment = Environment.SANDBOX
        )
    }
}
\`\`\`

## 4. Use SDK Features

Start KYC verification:

\`\`\`kotlin
paamSDK.startKYCVerification(
    userId = "user123",
    callback = object : KYCCallback {
        override fun onSuccess(result: KYCResult) {
            // Handle success
        }
        
        override fun onError(error: PAAMError) {
            // Handle error
        }
    }
)
\`\`\``,
        platform: 'android',
        category: 'quickstart',
        order: 1
      },
      {
        title: 'iOS Quick Start',
        content: `# iOS Quick Start Guide

## 1. Add Dependencies

Add the following to your Podfile:

\`\`\`ruby
platform :ios, '13.0'
use_frameworks!

target 'YourApp' do
  pod 'PAAMFinTechSDK', '~> 2.1.0'
end
\`\`\`

## 2. Update Permissions

Add these to your Info.plist:

\`\`\`xml
<key>NSCameraUsageDescription</key>
<string>This app needs access to camera for KYC verification</string>
<key>NSFaceIDUsageDescription</key>
<string>This app needs Face ID for secure authentication</string>
\`\`\`

## 3. Initialize SDK

Initialize the SDK in your AppDelegate:

\`\`\`swift
import PAAMFinTechSDK

func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    PAAMSDK.initialize(
        apiKey: "your-api-key",
        environment: .sandbox
    )
    return true
}
\`\`\`

## 4. Use SDK Features

Start KYC verification:

\`\`\`swift
paamSDK.startKYCVerification(
    userId: "user123"
) { [weak self] result in
    switch result {
    case .success(let kycResult):
        // Handle success
        break
    case .failure(let error):
        // Handle error
        break
    }
}
\`\`\``,
        platform: 'ios',
        category: 'quickstart',
        order: 1
      },
      {
        title: 'KYC Verification',
        content: `# KYC Verification

The KYC (Know Your Customer) verification feature allows you to verify user identities using document scanning and facial recognition.

## Features

- Document scanning (passport, ID card, driver's license)
- Facial recognition and liveness detection
- Real-time verification status
- Comprehensive risk assessment

## Android Implementation

\`\`\`kotlin
paamSDK.startKYCVerification(
    userId = "user123",
    documentType = DocumentType.PASSPORT,
    callback = object : KYCCallback {
        override fun onSuccess(result: KYCResult) {
            // Verification completed successfully
            Log.d("KYC", "Verification approved: \${result.isApproved}")
        }
        
        override fun onError(error: PAAMError) {
            // Handle verification error
            Log.e("KYC", "Error: \${error.message}")
        }
    }
)
\`\`\`

## iOS Implementation

\`\`\`swift
paamSDK.startKYCVerification(
    userId: "user123",
    documentType: .passport
) { [weak self] result in
    switch result {
    case .success(let kycResult):
        print("KYC Status: \\(kycResult.status)")
    case .failure(let error):
        print("Error: \\(error.localizedDescription)")
    }
}
\`\`\``,
        category: 'features',
        order: 1
      },
      {
        title: 'Payment Processing',
        content: `# Payment Processing

The payment processing feature enables secure payment transactions with multiple payment methods.

## Supported Payment Methods

- Credit/Debit Cards
- Apple Pay (iOS)
- Google Pay (Android)
- Bank transfers

## Android Implementation

\`\`\`kotlin
val paymentRequest = PaymentRequest(
    amount = 100.0,
    currency = "USD",
    paymentMethod = PaymentMethod.CREDIT_CARD,
    cardNumber = "4111111111111111",
    expiryDate = "12/25",
    cvv = "123"
)

paamSDK.processPayment(paymentRequest, object : PaymentCallback {
    override fun onSuccess(result: PaymentResult) {
        // Payment successful
        Log.d("Payment", "Transaction ID: \${result.transactionId}")
    }
    
    override fun onError(error: PAAMError) {
        // Payment failed
        Log.e("Payment", "Error: \${error.message}")
    }
})
\`\`\`

## iOS Implementation

\`\`\`swift
let paymentRequest = PKPaymentRequest()
paymentRequest.merchantIdentifier = "merchant.com.yourapp"
paymentRequest.supportedNetworks = [.visa, .masterCard, .amex]
paymentRequest.countryCode = "US"
paymentRequest.currencyCode = "USD"

paamSDK.processApplePay(paymentRequest) { result in
    switch result {
    case .success(let transaction):
        print("Payment successful: \\(transaction.transactionId)")
    case .failure(let error):
        print("Payment failed: \\(error.localizedDescription)")
    }
}
\`\`\``,
        category: 'features',
        order: 2
      },
      {
        title: 'API Reference',
        content: `# API Reference

## Authentication

All API requests require authentication using an API key.

\`\`\`
Authorization: Bearer your-api-key
\`\`\`

## Endpoints

### POST /api/v2/kyc/verify

Start KYC verification process.

**Parameters:**
- \`userId\` (string, required): Unique user identifier
- \`documentType\` (string, required): Type of document (passport, id_card, etc.)
- \`callbackUrl\` (string, optional): Webhook URL for results

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "verificationId": "ver_123456",
    "status": "pending",
    "expiresAt": "2024-12-31T23:59:59Z"
  }
}
\`\`\`

### GET /api/v2/kyc/status/{verificationId}

Check KYC verification status.

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "verificationId": "ver_123456",
    "status": "completed",
    "result": {
      "approved": true,
      "riskScore": 0.15,
      "checks": [
        {
          "type": "document_verification",
          "status": "passed"
        },
        {
          "type": "facial_recognition",
          "status": "passed"
        }
      ]
    }
  }
}
\`\`\`

### POST /api/v2/payments/process

Process payment transaction.

**Parameters:**
- \`amount\` (number, required): Transaction amount
- \`currency\` (string, required): 3-letter currency code
- \`paymentMethod\` (string, required): Payment method type
- \`customerId\` (string, required): Customer identifier

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "transactionId": "txn_789012",
    "status": "success",
    "amount": 100.00,
    "currency": "USD",
    "processedAt": "2024-01-15T10:30:00Z"
  }
}
\`\`\``,
        category: 'api',
        order: 1
      },
      {
        title: 'Example Projects',
        content: `# Example Projects

We provide complete example projects to help you get started quickly.

## Android Example App

The Android example app demonstrates all PAAM SDK features:

### Features Included
- KYC verification flow
- Payment processing
- Biometric authentication
- Real-time compliance monitoring

### Setup
1. Clone the repository
2. Open in Android Studio
3. Add your API key to \`local.properties\`
4. Build and run the app

### Key Files
- \`MainActivity.kt\` - Main activity with SDK initialization
- \`KYCFragment.kt\` - KYC verification implementation
- \`PaymentFragment.kt\` - Payment processing implementation
- \`BiometricFragment.kt\` - Biometric authentication implementation

## iOS Example App

The iOS example app demonstrates all PAAM SDK features:

### Features Included
- KYC verification with Face ID
- Apple Pay integration
- Touch ID authentication
- Real-time compliance monitoring

### Setup
1. Clone the repository
2. Open in Xcode
3. Add your API key to \`Config.swift\`
4. Build and run the app

### Key Files
- \`ViewController.swift\` - Main view controller with SDK initialization
- \`KYCViewController.swift\` - KYC verification implementation
- \`PaymentViewController.swift\` - Payment processing implementation
- \`BiometricViewController.swift\` - Biometric authentication implementation

## Best Practices

### Security
- Never hardcode API keys in your app
- Use secure storage for sensitive data
- Implement proper certificate pinning
- Use HTTPS for all network requests

### User Experience
- Provide clear feedback during verification processes
- Handle errors gracefully with helpful messages
- Implement proper loading states
- Support offline modes where possible

### Performance
- Cache frequently accessed data
- Use background threads for heavy operations
- Optimize image and document processing
- Monitor API usage and implement rate limiting`,
        category: 'examples',
        order: 1
      }
    ]
  })

  console.log('✅ Database seeded successfully!')
  console.log(`Created SDK versions: ${androidSdk.version} (${androidSdk.platform}), ${iosSdk.version} (${iosSdk.platform})`)
  console.log(`Created ${quickStartDocs.count} documentation entries`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })