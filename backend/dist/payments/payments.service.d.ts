import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './payment.schema';
export declare class PaymentsService implements OnModuleInit {
    private paymentModel;
    constructor(paymentModel: Model<PaymentDocument>);
    onModuleInit(): Promise<void>;
    create(paymentData: any): Promise<Payment>;
    findAll(query?: any): Promise<{
        payments: Payment[];
        total: number;
    }>;
    findOne(id: string): Promise<Payment>;
    getStats(): Promise<any>;
    private seedPayments;
}
