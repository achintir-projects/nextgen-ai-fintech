import { db } from './db'
import { EvidenceEngine } from './evidence-engine'

export interface TransactionRequest {
  fromAccountId: string
  toAccountId?: string
  amount: number
  currency?: string
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'PAYMENT'
  description?: string
  metadata?: any
  userId?: string
  ipAddress?: string
  userAgent?: string
}

export interface LedgerEntry {
  id: string
  accountId: string
  amount: number
  currency: string
  type: 'DEBIT' | 'CREDIT'
  balance: number
  transactionId: string
  createdAt: Date
}

export class LedgerService {
  /**
   * Create a new transaction with double-entry accounting
   */
  static async createTransaction(request: TransactionRequest): Promise<any> {
    const {
      fromAccountId,
      toAccountId,
      amount,
      currency = 'USD',
      type,
      description,
      metadata,
      userId,
      ipAddress,
      userAgent
    } = request

    // Validate amount
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0')
    }

    // Get accounts
    const fromAccount = await db.account.findUnique({
      where: { id: fromAccountId }
    })

    if (!fromAccount) {
      throw new Error('From account not found')
    }

    if (fromAccount.status !== 'ACTIVE') {
      throw new Error('From account is not active')
    }

    let toAccount = null
    if (toAccountId) {
      toAccount = await db.account.findUnique({
        where: { id: toAccountId }
      })

      if (!toAccount) {
        throw new Error('To account not found')
      }

      if (toAccount.status !== 'ACTIVE') {
        throw new Error('To account is not active')
      }
    }

    // Check if from account has sufficient balance (for withdrawals and transfers)
    if (type === 'WITHDRAWAL' || type === 'TRANSFER') {
      if (fromAccount.availableBalance < amount) {
        throw new Error('Insufficient funds')
      }
    }

    // Generate unique reference ID
    const referenceId = this.generateReferenceId()

    // Create transaction using a transaction to ensure atomicity
    const result = await db.$transaction(async (tx) => {
      // Create the transaction record
      const transaction = await tx.transaction.create({
        data: {
          referenceId,
          fromAccountId,
          toAccountId,
          amount,
          currency,
          type,
          description,
          metadata: metadata || {},
          customerId: fromAccount.customerId
        }
      })

      // Create ledger entries
      const ledgerEntries = []

      // Debit entry (money leaving from account)
      const debitEntry = await tx.ledgerEntry.create({
        data: {
          accountId: fromAccountId,
          amount: -amount,
          currency,
          type: 'DEBIT',
          balance: fromAccount.balance - amount,
          transactionId: transaction.id
        }
      })
      ledgerEntries.push(debitEntry)

      // Update from account balance
      await tx.account.update({
        where: { id: fromAccountId },
        data: {
          balance: fromAccount.balance - amount,
          availableBalance: fromAccount.availableBalance - amount
        }
      })

      // Credit entry (money coming to account) - for deposits and transfers
      if (type === 'DEPOSIT' || (type === 'TRANSFER' && toAccount)) {
        const targetAccount = type === 'DEPOSIT' ? fromAccount : toAccount!
        const creditEntry = await tx.ledgerEntry.create({
          data: {
            accountId: targetAccount.id,
            amount: amount,
            currency,
            type: 'CREDIT',
            balance: targetAccount.balance + amount,
            transactionId: transaction.id
          }
        })
        ledgerEntries.push(creditEntry)

        // Update target account balance
        await tx.account.update({
          where: { id: targetAccount.id },
          data: {
            balance: targetAccount.balance + amount,
            availableBalance: targetAccount.availableBalance + amount
          }
        })
      }

      return { transaction, ledgerEntries }
    })

    // Log the transaction event to audit trail
    await EvidenceEngine.logTransactionEvent(
      result.transaction.id,
      'CREATE',
      {
        referenceId,
        amount,
        currency,
        type,
        fromAccountId,
        toAccountId,
        description
      },
      userId,
      ipAddress,
      userAgent
    )

    return result.transaction
  }

  /**
   * Get account balance and transaction history
   */
  static async getAccountHistory(accountId: string, limit = 50, offset = 0) {
    const account = await db.account.findUnique({
      where: { id: accountId },
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

    if (!account) {
      throw new Error('Account not found')
    }

    const transactions = await db.transaction.findMany({
      where: {
        OR: [
          { fromAccountId: accountId },
          { toAccountId: accountId }
        ]
      },
      include: {
        fromAccount: {
          select: {
            id: true,
            accountNumber: true,
            accountType: true
          }
        },
        toAccount: {
          select: {
            id: true,
            accountNumber: true,
            accountType: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    const ledgerEntries = await db.ledgerEntry.findMany({
      where: { accountId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    return {
      account,
      transactions,
      ledgerEntries
    }
  }

  /**
   * Get account statement for a period
   */
  static async getAccountStatement(accountId: string, startDate: Date, endDate: Date) {
    const account = await db.account.findUnique({
      where: { id: accountId }
    })

    if (!account) {
      throw new Error('Account not found')
    }

    const transactions = await db.transaction.findMany({
      where: {
        OR: [
          { fromAccountId: accountId },
          { toAccountId: accountId }
        ],
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        fromAccount: {
          select: {
            id: true,
            accountNumber: true,
            accountType: true
          }
        },
        toAccount: {
          select: {
            id: true,
            accountNumber: true,
            accountType: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    const ledgerEntries = await db.ledgerEntry.findMany({
      where: {
        accountId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    // Calculate opening and closing balances
    const openingBalance = await this.getBalanceAtDate(accountId, startDate)
    const closingBalance = await this.getBalanceAtDate(accountId, endDate)

    return {
      account,
      period: {
        start: startDate,
        end: endDate
      },
      openingBalance,
      closingBalance,
      transactions,
      ledgerEntries
    }
  }

  /**
   * Get balance at a specific date
   */
  private static async getBalanceAtDate(accountId: string, date: Date) {
    const latestEntry = await db.ledgerEntry.findFirst({
      where: {
        accountId,
        createdAt: {
          lte: date
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return latestEntry?.balance || 0
  }

  /**
   * Generate unique reference ID
   */
  private static generateReferenceId(): string {
    const timestamp = Date.now().toString()
    const random = Math.random().toString(36).substring(2, 8)
    return `TXN_${timestamp}_${random}`.toUpperCase()
  }

  /**
   * Create a deposit transaction
   */
  static async deposit(
    accountId: string,
    amount: number,
    description?: string,
    userId?: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    return await this.createTransaction({
      fromAccountId: accountId,
      amount,
      type: 'DEPOSIT',
      description,
      userId,
      ipAddress,
      userAgent
    })
  }

  /**
   * Create a withdrawal transaction
   */
  static async withdraw(
    accountId: string,
    amount: number,
    description?: string,
    userId?: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    return await this.createTransaction({
      fromAccountId: accountId,
      amount,
      type: 'WITHDRAWAL',
      description,
      userId,
      ipAddress,
      userAgent
    })
  }

  /**
   * Create a transfer transaction
   */
  static async transfer(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    description?: string,
    userId?: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    return await this.createTransaction({
      fromAccountId,
      toAccountId,
      amount,
      type: 'TRANSFER',
      description,
      userId,
      ipAddress,
      userAgent
    })
  }

  /**
   * Get account balance
   */
  static async getBalance(accountId: string) {
    const account = await db.account.findUnique({
      where: { id: accountId }
    })

    if (!account) {
      throw new Error('Account not found')
    }

    return {
      balance: account.balance,
      availableBalance: account.availableBalance,
      currency: account.currency,
      status: account.status
    }
  }
}