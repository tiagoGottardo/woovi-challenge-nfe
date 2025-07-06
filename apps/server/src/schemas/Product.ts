import mongoose, { Document, Schema } from "mongoose";

interface IProduct extends Document {
  name: string;
  description?: string;
  // ncm: string;
  // cest?: string;
  sku: string;
  price: number;
  unitOfMeasure: string;
  // origin: number;
  // cfop: string;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  // ncm: { type: String, required: true },
  // cest: { type: String, required: false },
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  unitOfMeasure: { type: String, required: true },
  // origin: { type: Number, required: true },
  // cfop: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
