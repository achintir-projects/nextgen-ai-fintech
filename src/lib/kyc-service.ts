import { db } from './db'
import { EvidenceEngine } from './evidence-engine'

export interface KYCVerificationRequest {
  customerId: string
  profileType: 'INDIVIDUAL' | 'BUSINESS' | 'TRUST'
  documents: KYCDocument[]
  checks: KYCCheckType[]
  userId?: string
  ipAddress?: string
  userAgent?: string
}

export interface KYCDocument {
  type: 'PASSPORT' | 'DRIVERS_LICENSE' | 'NATIONAL_ID' | 'UTILITY_BILL' | 'BANK_STATEMENT' | 'PROOF_OF_ADDRESS' | 'BUSINESS_REGISTRATION' | 'TAX_ID'
  documentNumber?: string
  issuedDate?: Date
  expiryDate?: Date
  issuingCountry?: string
  fileUrl?: string
  extractedData?: any
}

export type KYCCheckType = 'SANCTIONS' | 'PEP' | 'WATCHLIST' | 'ID_VERIFICATION' | 'AGE_VERIFICATION' | 'ADDRESS_VERIFICATION'

export interface KYCCheckResult {
  checkType: KYCCheckType
  status: 'PASSED' | 'FAILED' | 'REVIEW_REQUIRED' | 'ERROR'
  result?: any
  riskScore?: number
  message?: string
}

export class KYCService {
  /**
   * Create a new KYC profile and initiate verification
   */
  static async createKYCProfile(request: KYCVerificationRequest): Promise<any> {
    const {
      customerId,
      profileType,
      documents,
      checks,
      userId,
      ipAddress,
      userAgent
    } = request

    // Verify customer exists
    const customer = await db.customer.findUnique({
      where: { id: customerId }
    })

    if (!customer) {
      throw new Error('Customer not found')
    }

    // Create KYC profile
    const kycProfile = await db.kYCProfile.create({
      data: {
        customerId,
        profileType,
        verificationStatus: 'IN_PROGRESS'
      }
    })

    // Create documents
    const createdDocuments = []
    for (const doc of documents) {
      const document = await db.kYCDocument.create({
        data: {
          kycProfileId: kycProfile.id,
          documentType: doc.type,
          documentNumber: doc.documentNumber,
          issuedDate: doc.issuedDate,
          expiryDate: doc.expiryDate,
          issuingCountry: doc.issuingCountry,
          fileUrl: doc.fileUrl,
          extractedData: doc.extractedData
        }
      })
      createdDocuments.push(document)
    }

    // Create checks
    const createdChecks = []
    for (const checkType of checks) {
      const check = await db.kYCCheck.create({
        data: {
          kycProfileId: kycProfile.id,
          checkType,
          provider: this.getProviderForCheck(checkType),
          status: 'PENDING'
        }
      })
      createdChecks.push(check)
    }

    // Log KYC profile creation
    await EvidenceEngine.logKYCEvent(
      kycProfile.id,
      'CREATE',
      {
        profileType,
        documentCount: documents.length,
        checkCount: checks.length
      },
      userId,
      ipAddress,
      userAgent
    )

    // Start asynchronous verification process
    this.startVerificationProcess(kycProfile.id, createdChecks)

    return {
      kycProfile,
      documents: createdDocuments,
      checks: createdChecks
    }
  }

  /**
   * Start the verification process for a KYC profile
   */
  private static async startVerificationProcess(kycProfileId: string, checks: any[]) {
    try {
      // Process each check asynchronously
      const verificationPromises = checks.map(async (check) => {
        const result = await this.performKYCCheck(check.id, check.checkType)
        
        // Update check status
        await db.kYCCheck.update({
          where: { id: check.id },
          data: {
            status: result.status,
            result: result.result,
            riskScore: result.riskScore
          }
        })

        return result
      })

      const results = await Promise.all(verificationPromises)

      // Calculate overall verification status
      const overallStatus = this.calculateOverallStatus(results)

      // Update KYC profile status
      await db.kYCProfile.update({
        where: { id: kycProfileId },
        data: {
          verificationStatus: overallStatus,
          riskScore: this.calculateRiskScore(results)
        }
      })

      // Log verification completion
      await EvidenceEngine.logKYCEvent(
        kycProfileId,
        'VERIFICATION_COMPLETE',
        {
          overallStatus,
          results,
          riskScore: this.calculateRiskScore(results)
        }
      )

      return results
    } catch (error) {
      console.error('KYC verification error:', error)
      
      // Update profile status to ERROR
      await db.kYCProfile.update({
        where: { id: kycProfileId },
        data: {
          verificationStatus: 'ERROR'
        }
      })

      // Log error
      await EvidenceEngine.logKYCEvent(
        kycProfileId,
        'VERIFICATION_ERROR',
        {
          error: error.message
        }
      )

      throw error
    }
  }

  /**
   * Perform a specific KYC check
   */
  private static async performKYCCheck(checkId: string, checkType: KYCCheckType): Promise<KYCCheckResult> {
    // This is a mock implementation - in production, this would integrate with real providers
    // like ComplyAdvantage, Refinitiv, etc.
    
    switch (checkType) {
      case 'SANCTIONS':
        return await this.performSanctionsCheck()
      case 'PEP':
        return await this.performPEPCheck()
      case 'WATCHLIST':
        return await this.performWatchlistCheck()
      case 'ID_VERIFICATION':
        return await this.performIDVerification()
      case 'AGE_VERIFICATION':
        return await this.performAgeVerification()
      case 'ADDRESS_VERIFICATION':
        return await this.performAddressVerification()
      default:
        throw new Error(`Unsupported check type: ${checkType}`)
    }
  }

  /**
   * Mock sanctions check
   */
  private static async performSanctionsCheck(): Promise<KYCCheckResult> {
    // Simulate API call to sanctions screening service
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock result - in production, this would call real providers
    const isMatch = Math.random() > 0.9 // 10% chance of match for demo
    
    return {
      checkType: 'SANCTIONS',
      status: isMatch ? 'FAILED' : 'PASSED',
      result: {
        provider: 'MockSanctionsProvider',
        checkedLists: ['OFAC', 'UN', 'EU'],
        matchFound: isMatch,
        matches: isMatch ? [{
          name: 'John Doe',
          list: 'OFAC',
          score: 0.95
        }] : []
      },
      riskScore: isMatch ? 0.95 : 0.1,
      message: isMatch ? 'Potential sanctions match found' : 'No sanctions matches found'
    }
  }

  /**
   * Mock PEP (Politically Exposed Person) check
   */
  private static async performPEPCheck(): Promise<KYCCheckResult> {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const isPEP = Math.random() > 0.95 // 5% chance of being PEP for demo
    
    return {
      checkType: 'PEP',
      status: isPEP ? 'REVIEW_REQUIRED' : 'PASSED',
      result: {
        provider: 'MockPEPProvider',
        isPEP: isPEP,
        positions: isPEP ? ['Government Minister'] : [],
        countries: isPEP ? ['Country X'] : []
      },
      riskScore: isPEP ? 0.8 : 0.2,
      message: isPEP ? 'PEP status detected - manual review required' : 'No PEP status found'
    }
  }

  /**
   * Mock watchlist check
   */
  private static async performWatchlistCheck(): Promise<KYCCheckResult> {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const isOnWatchlist = Math.random() > 0.98 // 2% chance of being on watchlist
    
    return {
      checkType: 'WATCHLIST',
      status: isOnWatchlist ? 'FAILED' : 'PASSED',
      result: {
        provider: 'MockWatchlistProvider',
        isOnWatchlist: isOnWatchlist,
        lists: isOnWatchlist ? ['FATF', 'Interpol'] : []
      },
      riskScore: isOnWatchlist ? 0.9 : 0.1,
      message: isOnWatchlist ? 'Watchlist match found' : 'No watchlist matches found'
    }
  }

  /**
   * Mock ID verification
   */
  private static async performIDVerification(): Promise<KYCCheckResult> {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const isValid = Math.random() > 0.1 // 90% chance of valid ID
    
    return {
      checkType: 'ID_VERIFICATION',
      status: isValid ? 'PASSED' : 'FAILED',
      result: {
        provider: 'MockIDProvider',
        isValid: isValid,
        confidence: isValid ? 0.95 : 0.3,
        extractedData: isValid ? {
          name: 'John Doe',
          dateOfBirth: '1990-01-01',
          documentNumber: 'AB123456'
        } : null
      },
      riskScore: isValid ? 0.1 : 0.8,
      message: isValid ? 'ID verification successful' : 'ID verification failed'
    }
  }

  /**
   * Mock age verification
   */
  private static async performAgeVerification(): Promise<KYCCheckResult> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const isAdult = Math.random() > 0.05 // 95% chance of being adult
    
    return {
      checkType: 'AGE_VERIFICATION',
      status: isAdult ? 'PASSED' : 'FAILED',
      result: {
        provider: 'MockAgeProvider',
        isAdult: isAdult,
        age: isAdult ? 25 : 17
      },
      riskScore: isAdult ? 0.1 : 0.9,
      message: isAdult ? 'Age verification passed' : 'User is under 18'
    }
  }

  /**
   * Mock address verification
   */
  private static async performAddressVerification(): Promise<KYCCheckResult> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const isValid = Math.random() > 0.15 // 85% chance of valid address
    
    return {
      checkType: 'ADDRESS_VERIFICATION',
      status: isValid ? 'PASSED' : 'REVIEW_REQUIRED',
      result: {
        provider: 'MockAddressProvider',
        isValid: isValid,
        confidence: isValid ? 0.9 : 0.6,
        address: isValid ? '123 Main St, City, Country' : 'Invalid Address'
      },
      riskScore: isValid ? 0.2 : 0.6,
      message: isValid ? 'Address verification successful' : 'Address verification requires review'
    }
  }

  /**
   * Get provider for a specific check type
   */
  private static getProviderForCheck(checkType: KYCCheckType): string {
    const providers: Record<KYCCheckType, string> = {
      'SANCTIONS': 'ComplyAdvantage',
      'PEP': 'Refinitiv',
      'WATCHLIST': 'Dow Jones',
      'ID_VERIFICATION': 'Jumio',
      'AGE_VERIFICATION': 'Onfido',
      'ADDRESS_VERIFICATION': 'Trulioo'
    }
    
    return providers[checkType] || 'MockProvider'
  }

  /**
   * Calculate overall verification status
   */
  private static calculateOverallStatus(results: KYCCheckResult[]): 'APPROVED' | 'REJECTED' | 'REVIEW_REQUIRED' | 'ERROR' {
    const failedChecks = results.filter(r => r.status === 'FAILED')
    const reviewChecks = results.filter(r => r.status === 'REVIEW_REQUIRED')
    const errorChecks = results.filter(r => r.status === 'ERROR')
    
    if (errorChecks.length > 0) {
      return 'ERROR'
    }
    
    if (failedChecks.length > 0) {
      return 'REJECTED'
    }
    
    if (reviewChecks.length > 0) {
      return 'REVIEW_REQUIRED'
    }
    
    return 'APPROVED'
  }

  /**
   * Calculate overall risk score
   */
  private static calculateRiskScore(results: KYCCheckResult[]): number {
    if (results.length === 0) return 0.5
    
    const totalScore = results.reduce((sum, result) => sum + (result.riskScore || 0.5), 0)
    return totalScore / results.length
  }

  /**
   * Get KYC profile with all related data
   */
  static async getKYCProfile(kycProfileId: string) {
    return await db.kYCProfile.findUnique({
      where: { id: kycProfileId },
      include: {
        customer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        documents: true,
        checks: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })
  }

  /**
   * Get KYC profiles for a customer
   */
  static async getCustomerKYCProfiles(customerId: string) {
    return await db.kYCProfile.findMany({
      where: { customerId },
      include: {
        documents: true,
        checks: true
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  /**
   * Update KYC profile status
   */
  static async updateKYCProfileStatus(
    kycProfileId: string,
    status: 'APPROVED' | 'REJECTED' | 'REVIEW_REQUIRED',
    reason?: string,
    userId?: string
  ) {
    const profile = await db.kYCProfile.update({
      where: { id: kycProfileId },
      data: { verificationStatus: status }
    })

    // Log status update
    await EvidenceEngine.logKYCEvent(
      kycProfileId,
      'STATUS_UPDATE',
      {
        newStatus: status,
        reason
      },
      userId
    )

    return profile
  }
}