import mongoose, { Schema, Document } from "mongoose";

/* =========================
   ENUMS
========================= */

export enum PaymentMethod {
  CARD = "CARD",
  BANK = "BANK"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}

/* =========================
   INTERFACE
========================= */

export interface IPayment extends Document {
  _id: mongoose.Types.ObjectId;

  userId: mongoose.Types.ObjectId;

  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;

  // Card Fields (Optional)
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;

  // Bank Fields (Optional)
  bankName?: string;
  accountHolder?: string;
  accountNumber?: string;
  ifscCode?: string;
  transactionId?: string;
  slipFilePath?: string;
}

/* =========================
   SCHEMA
========================= */

const PaymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true
    },

    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING
    },

    // ===== Card Fields =====
    cardNumber: { type: String },
    cardHolder: { type: String },
    expiryDate: { type: String },

    // ===== Bank Fields =====
    bankName: { type: String },
    accountHolder: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    transactionId: { type: String },
    slipFilePath: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>("Payment", PaymentSchema);