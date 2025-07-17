import mongoose, { Document, Schema } from "mongoose";

interface Address {
  street: string;
  addressNumber: string;
  neighborhood: string;
  cityCode: string;
  city: string;
  uf: string;
  zipCode: string;
}

interface ICompany extends Document {
  name: string;
  cnpj: string;
  address: Address;
  nfceSerie: number;
  certificatePass?: string;
  danfeEmails: string[];
  phone: string;
  stateSubscription: string;
  taxRegime: "Simples Nacional";
  csc: string;
  createdAt: Date;
}

const AddressSchema: Schema = new Schema({
  street: { type: String, required: true },
  addressNumber: { type: String, required: true },
  neighborhood: { type: String, required: true },
  cityCode: { type: String, required: true },
  city: { type: String, required: true },
  uf: { type: String, required: true },
  zipCode: { type: String, required: true },
}, { _id: false });

const CompanySchema: Schema = new Schema({
  name: { type: String, required: true },
  cnpj: { type: String, required: true, unique: true },
  address: { type: AddressSchema, required: true },
  nfceSerie: { type: Number, required: true, default: 0 },
  certificatePass: { type: String },
  danfeEmails: [{ type: String, default: [] }],
  phone: { type: String, required: true },
  stateSubscription: { type: String, required: true },
  taxRegime: { type: String, required: true, enum: ["Simples Nacional"] },
  csc: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Company = mongoose.model<ICompany>("Company", CompanySchema);

export default Company;
