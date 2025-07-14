import mongoose, { Document, Schema } from "mongoose";

interface IClientCompany extends Document {
  name: string;
  cnpj: string;
  stateRegistration: string;
  isExemptIE: boolean;
  address: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

const ClientCompanySchema: Schema = new Schema({
  name: { type: String, required: true },
  cnpj: { type: String, required: true, unique: true },
  stateRegistration: { type: String, required: true },
  isExemptIE: { type: Boolean, required: true, default: false },
  address: { type: String, required: true },
  number: { type: String, required: true },
  complement: { type: String, required: false },
  neighborhood: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
});

const ClientCompany = mongoose.model<IClientCompany>("ClientCompany", ClientCompanySchema);

export default ClientCompany;
