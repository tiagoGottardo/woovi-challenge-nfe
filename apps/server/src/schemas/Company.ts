import mongoose, { Document, Schema } from "mongoose"

interface ICompany extends Document {
  name: string;
  cnpj: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: Date;
}

const CompanySchema: Schema = new Schema({
  name: { type: String, required: true },
  cnpj: { type: String, require: true, unique: true },
  address: { type: String, require: true },
  city: { type: String, require: true },
  state: { type: String, require: true },
  zipCode: { type: String, require: true },
  createdAt: { type: Date, default: Date.now },
});

const Company = mongoose.model<ICompany>('Company', CompanySchema)

export default Company
