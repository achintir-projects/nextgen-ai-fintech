import crypto from 'crypto'
import { db } from './db'

export interface AuditEntryData {
  entityType: string
  entityId: string
  action: string
  data: any
  userId?: string
  ipAddress?: string
  userAgent?: string
}

export class EvidenceEngine {
  /**
   * Create a new audit entry with hash-chain integrity
   */
  static async createAuditEntry(entryData: AuditEntryData): Promise<string> {
    // Get the previous hash for chain integrity
    const previousEntry = await db.auditEntry.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    const previousHash = previousEntry?.currentHash || 'genesis'

    // Create the entry data object
    const entryWithMetadata = {
      ...entryData,
      timestamp: new Date().toISOString(),
      previousHash
    }

    // Generate current hash
    const currentHash = this.generateHash(entryWithMetadata)

    // Create the audit entry
    const auditEntry = await db.auditEntry.create({
      data: {
        ...entryData,
        previousHash,
        currentHash,
        data: entryData.data
      }
    })

    return auditEntry.id
  }

  /**
   * Verify the integrity of the audit chain
   */
  static async verifyAuditChain(): Promise<{ isValid: boolean; brokenAt?: string }> {
    const auditEntries = await db.auditEntry.findMany({
      orderBy: { createdAt: 'asc' }
    })

    for (let i = 0; i < auditEntries.length; i++) {
      const entry = auditEntries[i]
      
      // Verify the hash
      const expectedHash = this.generateHash({
        entityType: entry.entityType,
        entityId: entry.entityId,
        action: entry.action,
        data: entry.data,
        userId: entry.userId,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
        timestamp: entry.createdAt.toISOString(),
        previousHash: entry.previousHash
      })

      if (expectedHash !== entry.currentHash) {
        return { isValid: false, brokenAt: entry.id }
      }

      // Verify chain integrity (except for genesis)
      if (i > 0 && entry.previousHash !== auditEntries[i - 1].currentHash) {
        return { isValid: false, brokenAt: entry.id }
      }
    }

    return { isValid: true }
  }

  /**
   * Get audit entries for a specific entity
   */
  static async getEntityHistory(entityType: string, entityId: string) {
    return await db.auditEntry.findMany({
      where: {
        entityType,
        entityId
      },
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })
  }

  /**
   * Get audit entries for a customer
   */
  static async getCustomerHistory(customerId: string) {
    return await db.auditEntry.findMany({
      where: {
        customerId
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  /**
   * Generate a SHA-256 hash for the given data
   */
  private static generateHash(data: any): string {
    const hash = crypto.createHash('sha256')
    hash.update(JSON.stringify(data))
    return hash.digest('hex')
  }

  /**
   * Create audit entries for customer lifecycle events
   */
  static async logCustomerEvent(
    customerId: string,
    action: string,
    data: any,
    userId?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<string> {
    return await this.createAuditEntry({
      entityType: 'Customer',
      entityId: customerId,
      action,
      data,
      userId,
      ipAddress,
      userAgent
    })
  }

  /**
   * Create audit entries for KYC events
   */
  static async logKYCEvent(
    kycProfileId: string,
    action: string,
    data: any,
    userId?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<string> {
    return await this.createAuditEntry({
      entityType: 'KYCProfile',
      entityId: kycProfileId,
      action,
      data,
      userId,
      ipAddress,
      userAgent
    })
  }

  /**
   * Create audit entries for transaction events
   */
  static async logTransactionEvent(
    transactionId: string,
    action: string,
    data: any,
    userId?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<string> {
    return await this.createAuditEntry({
      entityType: 'Transaction',
      entityId: transactionId,
      action,
      data,
      userId,
      ipAddress,
      userAgent
    })
  }

  /**
   * Create audit entries for account events
   */
  static async logAccountEvent(
    accountId: string,
    action: string,
    data: any,
    userId?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<string> {
    return await this.createAuditEntry({
      entityType: 'Account',
      entityId: accountId,
      action,
      data,
      userId,
      ipAddress,
      userAgent
    })
  }

  /**
   * Get audit trail summary for compliance reporting
   */
  static async getAuditSummary(startDate: Date, endDate: Date) {
    const entries = await db.auditEntry.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const summary = {
      totalEntries: entries.length,
      byEntityType: {} as Record<string, number>,
      byAction: {} as Record<string, number>,
      byDate: {} as Record<string, number>,
      integrityVerified: await this.verifyAuditChain()
    }

    entries.forEach(entry => {
      summary.byEntityType[entry.entityType] = (summary.byEntityType[entry.entityType] || 0) + 1
      summary.byAction[entry.action] = (summary.byAction[entry.action] || 0) + 1
      
      const date = entry.createdAt.toISOString().split('T')[0]
      summary.byDate[date] = (summary.byDate[date] || 0) + 1
    })

    return summary
  }

  /**
   * Export audit trail for compliance reporting
   */
  static async exportAuditTrail(startDate: Date, endDate: Date) {
    const entries = await db.auditEntry.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { createdAt: 'asc' },
      include: {
        customer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    return {
      metadata: {
        exportDate: new Date().toISOString(),
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        },
        totalEntries: entries.length,
        integrityVerified: await this.verifyAuditChain()
      },
      entries: entries.map(entry => ({
        id: entry.id,
        timestamp: entry.createdAt.toISOString(),
        entityType: entry.entityType,
        entityId: entry.entityId,
        action: entry.action,
        customer: entry.customer,
        userId: entry.userId,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
        previousHash: entry.previousHash,
        currentHash: entry.currentHash,
        data: entry.data
      }))
    }
  }
}