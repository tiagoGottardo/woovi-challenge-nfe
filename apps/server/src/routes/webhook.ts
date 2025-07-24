import { ParameterizedContext } from "koa"
import { NFeAutorizacaoLoteInput } from "../utils/sefazTypes"
import Sale from "../models/Sale"
import Company from "../models/Company"
import { getAccessKey, getDetAndVTotTrib } from "../utils/nfe"
import { Builder, parseStringPromise } from "xml2js"
import { emitNFCe, signNfe } from "../utils/nfe"
import { config } from "../config"
import { version } from '../../package.json'

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

  const accessKey = getAccessKey(company.address.cityCode.slice(0, 2), company.cnpj, company.nfceSerie, company.id)
  if (!accessKey) {
    ctx.status = 500
    return
  }

  const { fullKey, cDV } = accessKey

  const { det, vTotTrib } = await getDetAndVTotTrib(sale.items, sale.buyerUF == company.address.uf)

  const nfeInput: NFeAutorizacaoLoteInput = {
    nfeDadosMsg: {
      idLote: company.nfceSerie.toString().padStart(15, "0"),
      indSinc: '1',
      NFe: [
        {
          infNFe: {
            Id: fullKey,
            versao: '4.00',
            ide: {
              cUF: company.address.cityCode.slice(0, 2),
              cNF: company.id,
              natOp: 'VENDA DE MERCADORIA ADQUIRIDA OU RECEBIDA DE TERCEIROS',
              mod: '65',
              serie: '1',
              nNF: company.nfceSerie,
              dhEmi: (new Date(requestBody.doneAt || Date.now()).toString()),
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
              verProc: version,
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
            det,
            total: {
              ICMSTot: {
                vProd: sale.totalAmount.toFixed(2),
                vFrete: sale.freightCost.toFixed(2),
                vNF: (sale.totalAmount + sale.freightCost).toFixed(2),
                vTotTrib
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
          }
        }
      ]
    }
  }

  const xmlString = (new Builder()).buildObject({ NFe: nfeInput.nfeDadosMsg.NFe[0] })
  const xmlSignedString = await signNfe(company.id, xmlString)

  const xmlSigned = await parseStringPromise(xmlSignedString, {
    explicitCharkey: false,
    mergeAttrs: true,
  })

  nfeInput.nfeDadosMsg.NFe[0].infNFe = xmlSigned.NFe.infNFe[0]
  nfeInput.nfeDadosMsg.NFe[0].Signature = xmlSigned.NFe.Signature[0]

  console.log("NFe Input to Sefaz: ", nfeInput)

  const url = `${config.SEFAZ_MOCK_URI}/ws/nfeautorizacao?wsdl`
  // const url = `https://nfe.sefaz.${company.address.uf}.gov.br/nfe/services/nfeautorizacao?wsdl`

  const result = await emitNFCe(url, nfeInput, company.id)

  // Do something with result...
  console.log("Sefaz Output:", result)

  ctx.status = 200
}

export {
  pixWebhookRoute
}
