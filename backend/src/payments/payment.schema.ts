import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer'] })
  method: string;

  @Prop({ required: true })
  receiver: string;

  @Prop({ required: true, enum: ['success', 'failed', 'pending'] })
  status: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  transactionId: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);