import mongoose, { Document, Schema } from "mongoose";

interface INFeTransactionItem {
  productId: mongoose.Schema.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  icms?: { cst: string; baseCalc: number; value: number; };
  ipi?: { cst: string; value: number; };
  pis?: { cst: string; value: number; };
  cofins?: { cst: string; value: number; };
}

interface INFeTransaction extends Document {
  companyId: mongoose.Schema.Types.ObjectId;
  clientCompanyId: mongoose.Schema.Types.ObjectId;

  transactionDate: Date; // Data e hora da transação
  items: INFeTransactionItem[]; // Array de produtos na transação

  // Totais da Nota Fiscal - Estritamente necessários
  totalProductsValue: number; // Soma do totalPrice dos itens
  totalDiscount?: number; // Valor total de desconto (opcional, mas importante se houver)
  totalShippingCost?: number; // Custo total do frete (opcional, mas comum)
  totalAmount: number; // Valor total da NF-e (soma de produtos + frete + impostos - descontos)

  // Informações de Transporte - Estritamente necessárias se houver movimentação de mercadoria
  shippingType: "0" | "1" | "2" | "3" | "4" | "9"; // Tipo de frete (0-Por conta do Emitente, 1-Por conta do Destinatário, etc.)
  carrierCnpj?: string; // CNPJ da transportadora (se houver)
  vehiclePlate?: string; // Placa do veículo (se houver)
  vehicleUF?: string; // UF da placa (se houver)
  weightGross?: number; // Peso bruto (kg)
  weightNet?: number; // Peso líquido (kg)

  // Dados da NFe após a emissão
  nfeKey?: string; // Chave de acesso da NF-e
  nfeNumber?: number; // Número da NF-e
  nfeSeries?: number; // Série da NF-e

  // Controle interno, não estritamente fiscal, mas útil para o sistema
  status: "pending" | "approved" | "rejected" | "canceled";
  createdAt: Date;
}

const NFeTransactionSchema: Schema = new Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  clientCompanyId: { type: mongoose.Schema.Types.ObjectId, ref: "ClientCompany", required: true },

  transactionDate: { type: Date, required: true, default: Date.now },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
      // Impostos por item
      icms: {
        cst: { type: String, required: false },
        baseCalc: { type: Number, required: false },
        value: { type: Number, required: false },
      },
      ipi: {
        cst: { type: String, required: false },
        value: { type: Number, required: false },
      },
      pis: {
        cst: { type: String, required: false },
        value: { type: Number, required: false },
      },
      cofins: {
        cst: { type: String, required: false },
        value: { type: Number, required: false },
      },
    },
  ],

  totalProductsValue: { type: Number, required: true },
  totalDiscount: { type: Number, required: false, default: 0 },
  totalShippingCost: { type: Number, required: false, default: 0 },
  totalAmount: { type: Number, required: true },

  shippingType: { type: String, enum: ["0", "1", "2", "3", "4", "9"], required: true },
  carrierCnpj: { type: String, required: false },
  vehiclePlate: { type: String, required: false },
  vehicleUF: { type: String, required: false },
  weightGross: { type: Number, required: false },
  weightNet: { type: Number, required: false },

  nfeKey: { type: String, required: false },
  nfeNumber: { type: Number, required: false },
  nfeSeries: { type: Number, required: false },

  status: { type: String, enum: ["pending", "approved", "rejected", "canceled"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const NFeTransaction = mongoose.model<INFeTransaction>("NFeTransaction", NFeTransactionSchema);

export default NFeTransaction;
