import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './payment.schema';

@Injectable()
export class PaymentsService implements OnModuleInit {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  async onModuleInit() {
    await this.seedPayments();
  }

  async create(paymentData: any): Promise<Payment> {
    const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5);
    const payment = new this.paymentModel({
      ...paymentData,
      transactionId,
    });
    return payment.save();
  }

  async findAll(query: any = {}): Promise<{ payments: Payment[]; total: number }> {
    const { page = 1, limit = 10, status, method, startDate, endDate } = query;
    
    const filter: any = {};
    if (status) filter.status = status;
    if (method) filter.method = method;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const payments = await this.paymentModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .exec();

    const total = await this.paymentModel.countDocuments(filter);
    
    return { payments, total };
  }

  async findOne(id: string): Promise<Payment> {
    return this.paymentModel.findById(id).exec();
  }

  async getStats(): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);

    const [todayStats, weekStats, failedCount, totalRevenue] = await Promise.all([
      this.paymentModel.countDocuments({ createdAt: { $gte: today } }),
      this.paymentModel.countDocuments({ createdAt: { $gte: thisWeek } }),
      this.paymentModel.countDocuments({ status: 'failed' }),
      this.paymentModel.aggregate([
        { $match: { status: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    return {
      transactionsToday: todayStats,
      transactionsThisWeek: weekStats,
      failedTransactions: failedCount,
      totalRevenue: totalRevenue[0]?.total || 0,
    };
  }

  private async seedPayments() {
    const count = await this.paymentModel.countDocuments();
    if (count === 0) {
      const samplePayments = [
        { amount: 100.50, method: 'credit_card', receiver: 'John Doe', status: 'success', description: 'Product purchase' },
        { amount: 250.00, method: 'paypal', receiver: 'Jane Smith', status: 'success', description: 'Service payment' },
        { amount: 75.25, method: 'debit_card', receiver: 'Bob Johnson', status: 'failed', description: 'Subscription' },
        { amount: 500.00, method: 'bank_transfer', receiver: 'Alice Brown', status: 'pending', description: 'Invoice payment' },
        { amount: 150.75, method: 'credit_card', receiver: 'Charlie Wilson', status: 'success', description: 'Online purchase' },
      ];

      for (const payment of samplePayments) {
        await this.create(payment);
      }
      console.log('Sample payments created');
    }
  }
}