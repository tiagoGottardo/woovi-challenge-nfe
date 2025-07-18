import mongoose, { Document, Schema } from "mongoose"

export interface ISaleItem extends Document {
  productId: mongoose.Schema.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface ISale extends Document {
  companyId: mongoose.Schema.Types.ObjectId;
  freightCost: number;
  pixKey: string;
  buyerUF: string;
  items: ISaleItem[];
  totalAmount: number;
  status: "pending" | "approved" | "rejected" | "canceled";
  createdAt: Date;
  updatedAt: Date;
}

const SaleItemSchema: Schema = new Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
}, { _id: false })

const SaleSchema: Schema = new Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  freightCost: { type: Number, required: true },
  pixKey: { type: String, required: true },
  buyerUF: { type: String, required: true },
  items: [SaleItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected", "canceled"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

SaleSchema.pre("save", function(next) {
  this.updatedAt = new Date()
  next()
})

const Sale = mongoose.model<ISale>("Sale", SaleSchema)

export default Sale
