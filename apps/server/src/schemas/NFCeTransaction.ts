import mongoose, { Document, Schema } from "mongoose";

interface INfceTransactionItem {
  productId: mongoose.Schema.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface INfceTransaction extends Document {
  companyCnpj: mongoose.Schema.Types.ObjectId;
  customerCpf?: string;
  customerName?: string;
  transactionDate: Date;
  items: INfceTransactionItem[];
  totalAmount: number;
  totalDiscount?: number;
  totalShippingCost?: number;
  paymentMethod: string;
  status: "pending" | "approved" | "canceled";
  nfeKey?: string;
  nfeNumber?: number;
  nfeSeries?: number;
  createdAt: Date;
  updatedAt: Date;
}

const NfceTransactionSchema: Schema = new Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },

  customerCpf: { type: String, required: false },
  customerName: { type: String, required: false },

  transactionDate: { type: Date, required: true, default: Date.now },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  totalDiscount: { type: Number, required: false, default: 0 },
  totalShippingCost: { type: Number, required: false, default: 0 },
  paymentMethod: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "canceled"], default: "pending" },
  nfeKey: { type: String, required: false },
  nfeNumber: { type: Number, required: false },
  nfeSeries: { type: Number, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

NfceTransactionSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

const NfceTransaction = mongoose.model<INfceTransaction>("NfceTransaction", NfceTransactionSchema);

export default NfceTransaction;
