import { db } from './db'
import { LedgerService } from './ledger-service'
import { EvidenceEngine } from './evidence-engine'

export interface PaymentRequest {
  amount: number
  currency: string
  source: PaymentSource
  destination: PaymentDestination
  description?: string
  metadata?: any
  customerId?: string
  userId?: string
  ipAddress?: string
  userAgent?: string
}

export interface PaymentSource {
  type: 'ACCOUNT' | 'CARD' | 'BANK_TRANSFER' | 'WALLET'
  accountId?: string
  cardToken?: string
  bankAccountId?: string
  walletId?: string
}

export interface PaymentDestination {
  type: 'ACCOUNT' | 'CARD' | 'BANK_TRANSFER' | 'WALLET' | 'EXTERNAL'
  accountId?: string
  cardToken?: string
  bankAccountId?: string
  walletId?: string
  externalAddress?: string
}

export interface PaymentResult {
  success: boolean
  paymentId: string
  transactionId?: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  message?: string
  error?: string
  processorResponse?: any
}

export interface PaymentAdapter {
  name: string
  processPayment(request: PaymentRequest): Promise<PaymentResult>
  refundPayment(paymentId: string, amount?: number): Promise<PaymentResult>
  getPaymentStatus(paymentId: string): Promise<any>
}

/**
 * Stripe Payment Adapter
 */
class StripeAdapter implements PaymentAdapter {
  name = 'Stripe'

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      // Mock Stripe integration
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const success = Math.random() > 0.1 // 90% success rate
      
      if (success) {
        const paymentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        return {
          success: true,
          paymentId,
          status: 'COMPLETED',
          message: 'Payment processed successfully',
          processorResponse: {
            id: paymentId,
            amount: request.amount,
            currency: request.currency,
            status: 'succeeded',
            paid: true
          }
        }
      } else {
        return {
          success: false,
          paymentId: '',
          status: 'FAILED',
          message: 'Payment failed',
          error: 'Insufficient funds or card declined'
        }
      }
    } catch (error) {
      return {
        success: false,
        paymentId: '',
        status: 'FAILED',
        message: 'Payment processing error',
        error: error.message
      }
    }
  }

  async refundPayment(paymentId: string, amount?: number): Promise<PaymentResult> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const success = Math.random() > 0.05 // 95% success rate
      
      if (success) {
        const refundId = `re_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        return {
          success: true,
          paymentId: refundId,
          status: 'COMPLETED',
          message: 'Refund processed successfully',
          processorResponse: {
            id: refundId,
            originalPaymentId: paymentId,
            amount: amount,
            status: 'succeeded'
          }
        }
      } else {
        return {
          success: false,
          paymentId: '',
          status: 'FAILED',
          message: 'Refund failed',
          error: 'Refund processing failed'
        }
      }
    } catch (error) {
      return {
        success: false,
        paymentId: '',
        status: 'FAILED',
        message: 'Refund processing error',
        error: error.message
      }
    }
  }

  async getPaymentStatus(paymentId: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return {
      id: paymentId,
      status: 'succeeded',
      amount: 1000,
      currency: 'usd',
      created: Date.now().toISOString()
    }
  }
}

/**
 * PayPal Payment Adapter
 */
class PayPalAdapter implements PaymentAdapter {
  name = 'PayPal'

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      const success = Math.random() > 0.15 // 85% success rate
      
      if (success) {
        const paymentId = `PAYID_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        return {
          success: true,
          paymentId,
          status: 'COMPLETED',
          message: 'Payment processed successfully',
          processorResponse: {
            id: paymentId,
            amount: request.amount,
            currency: request.currency,
            state: 'approved',
            create_time: Date.now()
          }
        }
      } else {
        return {
          success: false,
          paymentId: '',
          status: 'FAILED',
          message: 'Payment failed',
          error: 'PayPal payment declined'
        }
      }
    } catch (error) {
      return {
        success: false,
        paymentId: '',
        status: 'FAILED',
        message: 'Payment processing error',
        error: error.message
      }
    }
  }

  async refundPayment(paymentId: string, amount?: number): Promise<PaymentResult> {
    try {
      await new Promise(resolve => setTimeout(resolve, 700))
      
      const success = Math.random() > 0.1 // 90% success rate
      
      if (success) {
        const refundId = `REFUND_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        return {
          success: true,
          paymentId: refundId,
          status: 'COMPLETED',
          message: 'Refund processed successfully',
          processorResponse: {
            id: refundId,
            parent_payment: paymentId,
            amount: amount,
            state: 'completed'
          }
        }
      } else {
        return {
          success: false,
          paymentId: '',
          status: 'FAILED',
          message: 'Refund failed',
          error: 'PayPal refund failed'
        }
      }
    } catch (error) {
      return {
        success: false,
        paymentId: '',
        status: 'FAILED',
        message: 'Refund processing error',
        error: error.message
      }
    }
  }

  async getPaymentStatus(paymentId: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      id: paymentId,
      state: 'approved',
      amount: {
        total: '100.00',
        currency: 'USD'
      },
      create_time: Date.now()
    }
  }
}

/**
 * Bank Transfer Adapter
 */
class BankTransferAdapter implements PaymentAdapter {
  name = 'BankTransfer'

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)) // Bank transfers take longer
      
      const success = Math.random() > 0.2 // 80% success rate
      
      if (success) {
        const paymentId = `BT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        return {
          success: true,
          paymentId,
          status: 'COMPLETED',
          message: 'Bank transfer initiated successfully',
          processorResponse: {
            id: paymentId,
            amount: request.amount,
            currency: request.currency,
            status: 'completed',
            estimated_settlement: Date.now() + 2 * 24 * 60 * 60 * 1000 // 2 days
          }
        }
      } else {
        return {
          success: false,
          paymentId: '',
          status: 'FAILED',
          message: 'Bank transfer failed',
          error: 'Insufficient funds or invalid bank details'
        }
      }
    } catch (error) {
      return {
        success: false,
        paymentId: '',
        status: 'FAILED',
        message: 'Bank transfer processing error',
        error: error.message
      }
    }
  }

  async refundPayment(paymentId: string, amount?: number): Promise<PaymentResult> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const success = Math.random() > 0.15 // 85% success rate
      
      if (success) {
        const refundId = `BT_REFUND_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        return {
          success: true,
          paymentId: refundId,
          status: 'COMPLETED',
          message: 'Bank transfer refund processed successfully',
          processorResponse: {
            id: refundId,
            originalPaymentId: paymentId,
            amount: amount,
            status: 'completed'
          }
        }
      } else {
        return {
          success: false,
          paymentId: '',
          status: 'FAILED',
          message: 'Bank transfer refund failed',
          error: 'Refund processing failed'
        }
      }
    } catch (error) {
      return {
        success: false,
        paymentId: '',
        status: 'FAILED',
        message: 'Bank transfer refund processing error',
        error: error.message
      }
    }
  }

  async getPaymentStatus(paymentId: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    return {
      id: paymentId,
      status: 'completed',
      amount: 1000,
      currency: 'USD',
      settlement_date: Date.now() + 2 * 24 * 60 * 60 * 1000
    }
  }
}

/**
 * Unified Payment Service
 */
export class PaymentService {
  private static adapters: Map<string, PaymentAdapter> = new Map()

  static {
    // Initialize payment adapters
    this.adapters.set('stripe', new StripeAdapter())
    this.adapters.set('paypal', new PayPalAdapter())
    this.adapters.set('bank_transfer', new BankTransferAdapter())
  }

  /**
   * Process a payment using the specified adapter
   */
  static async processPayment(
    request: PaymentRequest,
    adapterName: string = 'stripe'
  ): Promise<PaymentResult> {
    const adapter = this.adapters.get(adapterName)
    
    if (!adapter) {
      throw new Error(`Payment adapter '${adapterName}' not found`)
    }

    try {
      // Validate payment request
      this.validatePaymentRequest(request)

      // Process payment
      const result = await adapter.processPayment(request)

      // If payment successful and involves internal account, create ledger transaction
      if (result.success && request.source.accountId) {
        try {
          const transaction = await LedgerService.createTransaction({
            fromAccountId: request.source.accountId,
            amount: request.amount,
            currency: request.currency,
            type: 'PAYMENT',
            description: request.description || `Payment to ${adapterName}`,
            metadata: {
              paymentProcessor: adapterName,
              paymentId: result.paymentId,
              ...request.metadata
            },
            userId: request.userId,
            ipAddress: request.ipAddress,
            userAgent: request.userAgent
          })

          result.transactionId = transaction.id
        } catch (error) {
          console.error('Failed to create ledger transaction:', error)
          // Don't fail the payment if ledger transaction fails, but log it
        }
      }

      // Log payment event
      await EvidenceEngine.logTransactionEvent(
        result.transactionId || `payment_${Date.now()}`,
        'PAYMENT_PROCESSED',
        {
          adapter: adapterName,
          amount: request.amount,
          currency: request.currency,
          success: result.success,
          paymentId: result.paymentId
        },
        request.userId,
        request.ipAddress,
        request.userAgent
      )

      return result
    } catch (error) {
      // Log payment error
      await EvidenceEngine.logTransactionEvent(
        `payment_error_${Date.now()}`,
        'PAYMENT_ERROR',
        {
          adapter: adapterName,
          amount: request.amount,
          currency: request.currency,
          error: error.message
        },
        request.userId,
        request.ipAddress,
        request.userAgent
      )

      throw error
    }
  }

  /**
   * Refund a payment
   */
  static async refundPayment(
    paymentId: string,
    adapterName: string = 'stripe',
    amount?: number
  ): Promise<PaymentResult> {
    const adapter = this.adapters.get(adapterName)
    
    if (!adapter) {
      throw new Error(`Payment adapter '${adapterName}' not found`)
    }

    const result = await adapter.refundPayment(paymentId, amount)

    // Log refund event
    await EvidenceEngine.logTransactionEvent(
      `refund_${Date.now()}`,
      'PAYMENT_REFUNDED',
      {
        adapter: adapterName,
        originalPaymentId: paymentId,
        refundAmount: amount,
        success: result.success
      }
    )

    return result
  }

  /**
   * Get payment status
   */
  static async getPaymentStatus(
    paymentId: string,
    adapterName: string = 'stripe'
  ): Promise<any> {
    const adapter = this.adapters.get(adapterName)
    
    if (!adapter) {
      throw new Error(`Payment adapter '${adapterName}' not found`)
    }

    return await adapter.getPaymentStatus(paymentId)
  }

  /**
   * Get available payment adapters
   */
  static getAvailableAdapters(): string[] {
    return Array.from(this.adapters.keys())
  }

  /**
   * Validate payment request
   */
  private static validatePaymentRequest(request: PaymentRequest): void {
    if (!request.amount || request.amount <= 0) {
      throw new Error('Invalid payment amount')
    }

    if (!request.currency || request.currency.length !== 3) {
      throw new Error('Invalid currency code')
    }

    if (!request.source || !request.source.type) {
      throw new Error('Payment source is required')
    }

    if (!request.destination || !request.destination.type) {
      throw new Error('Payment destination is required')
    }
  }

  /**
   * Get payment methods for a customer
   */
  static async getCustomerPaymentMethods(customerId: string) {
    const customer = await db.customer.findUnique({
      where: { id: customerId },
      include: {
        accounts: {
          where: { status: 'ACTIVE' }
        }
      }
    })

    if (!customer) {
      throw new Error('Customer not found')
    }

    return {
      accounts: customer.accounts.map(account => ({
        id: account.id,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        balance: account.balance,
        currency: account.currency
      }))
    }
  }

  /**
   * Get payment history for a customer
   */
  static async getCustomerPaymentHistory(customerId: string, limit = 50, offset = 0) {
    const transactions = await db.transaction.findMany({
      where: {
        customerId,
        type: 'PAYMENT'
      },
      include: {
        fromAccount: {
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

    return transactions
  }
}