"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const payment_schema_1 = require("./payment.schema");
let PaymentsService = class PaymentsService {
    constructor(paymentModel) {
        this.paymentModel = paymentModel;
    }
    async onModuleInit() {
        await this.seedPayments();
    }
    async create(paymentData) {
        const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5);
        const payment = new this.paymentModel({
            ...paymentData,
            transactionId,
        });
        return payment.save();
    }
    async findAll(query = {}) {
        const { page = 1, limit = 10, status, method, startDate, endDate } = query;
        const filter = {};
        if (status)
            filter.status = status;
        if (method)
            filter.method = method;
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate)
                filter.createdAt.$gte = new Date(startDate);
            if (endDate)
                filter.createdAt.$lte = new Date(endDate);
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
    async findOne(id) {
        return this.paymentModel.findById(id).exec();
    }
    async getStats() {
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
    async seedPayments() {
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
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map