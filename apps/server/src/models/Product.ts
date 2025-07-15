import mongoose, { Document, Schema } from "mongoose";

interface IProduct extends Document {
  companyId: Schema.Types.ObjectId;
  name: string;
  description: string;
  ncm: string;
  price: number;
  unitOfMeasure: "KG" | "UN" | "MT";
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  ncm: { type: String, required: true },
  price: { type: Number, required: true },
  unitOfMeasure: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
