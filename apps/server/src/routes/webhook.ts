import { nfe, NFeAutorizacaoLoteInput } from "../examples/autorizacao";
import { ParameterizedContext } from "koa";
import Sale from "../models/Sale";
import Company from "../models/Company";
import { getAccessKey, getDet } from "../utils";

const pixWebhookRoute = async (ctx: ParameterizedContext) => {
  const requestBody = ctx.request.body

  const sale = await Sale.findOne({ _id: requestBody.saleId })
  if (!sale) {
    ctx.status = 400
    ctx.body = { message: "Sale not found!" }
    return
  }

  const company = await Company.findOne({ _id: sale.companyId })
  if (!company) {
    ctx.status = 400
    ctx.body = { message: "Company not found!" }
    return
  }

  const accessKey = getAccessKey(company.address.stateCode, company.cnpj, company.nfceSerie, company.id)
  if (!accessKey) {
    ctx.status = 500
    return
  }

  const { fullKey, cDV } = accessKey

  const args: NFeAutorizacaoLoteInput = {
    nfeDadosMsg: {
      idLote: company.nfceSerie.toString().padStart(15, "0"),
      indSinc: '1',
      NFe: [
        {
          infNFe: {
            Id: fullKey,
            versao: '4.00',
            ide: {
              cUF: company.address.stateCode,
              cNF: company.id,
              natOp: 'VENDA DE MERCADORIA ADQUIRIDA OU RECEBIDA DE TERCEIROS',
              mod: '65',
              serie: '1',
              nNF: company.nfceSerie,
              dhEmi: (new Date(Date.now()).toString()),
              tpNF: '1',
              idDest: '1',
              cMunFG: company.address.cityCode,
              tpImp: '4',
              tpEmis: '1',
              cDV,
              tpAmb: '1',
              finNFe: '1',
              indFinal: '1',
              indPres: '1',
              procEmi: '0',
              verProc: 'WOOVI_V1.0', // TODO: Change to env variable
              idCSC: '1',
              CSC: company.csc
            },
            emit: {
              CNPJ: company.cnpj,
              xNome: company.name,
              xFant: company.name,
              enderEmit: {
                xLgr: company.address.street,
                nro: company.address.addressNumber,
                xBairro: company.address.neighborhood,
                cMun: company.address.cityCode,
                xMun: company.address.city,
                UF: company.address.uf,
                CEP: company.address.zipCode,
                cPais: '1058', xPais: 'BRASIL',
                fone: company.phone
              },
              IE: company.stateSubscription,
              CRT: '1'
            },
            det: await getDet(sale.items, sale.buyerUF == company.address.uf),
            total: {
              ICMSTot: {
                vProd: sale.totalAmount.toFixed(2),
                vFrete: sale.freightCost.toFixed(2),
                vNF: (sale.totalAmount + sale.freightCost).toFixed(2),
                vTotTrib: '0.00' // TODO: Do this with ncm table
              }
            },
            transp: { modFrete: '9' },
            pag: {
              detPag: [{
                indPag: '0',
                tPag: '16',
                vPag: (sale.totalAmount + sale.freightCost).toFixed(2)
              }]
            }
          },
          Signature: {}
        }
      ]
    }
  };

  const result = await nfe("https://localhost:3000/ws/nfeautorizacao?wsdl", args) // TODO: Update url by state
  console.log(result)

  ctx.status = 200
}

export {
  pixWebhookRoute
}
