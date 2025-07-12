import mongoose, { Document, Schema } from "mongoose";

interface ISaleItem extends Document {
  productId: mongoose.Schema.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface ISale extends Document {
  companyId: mongoose.Schema.Types.ObjectId
  // nfType: "NFe" | "NFCe";
  pixKey: string
  buyer?: mongoose.Schema.Types.ObjectId
  items: ISaleItem[]
  totalAmount: number
  status: "pending" | "approved" | "rejected" | "canceled"
  createdAt: Date
  updatedAt: Date
}

const SaleSchema: Schema = new Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  pixKey: { type: String, required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected", "canceled"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

SaleSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

const Sale = mongoose.model<ISale>("Sale", SaleSchema);

export default Sale;
