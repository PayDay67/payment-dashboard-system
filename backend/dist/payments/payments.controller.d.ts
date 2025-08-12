import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(createPaymentDto: any): Promise<import("./payment.schema").Payment>;
    findAll(query: any): Promise<{
        payments: import("./payment.schema").Payment[];
        total: number;
    }>;
    getStats(): Promise<any>;
    findOne(id: string): Promise<import("./payment.schema").Payment>;
}
