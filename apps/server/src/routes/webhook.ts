import { nfe, NFeAutorizacaoLoteInput } from "../examples/autorizacao";
import { ParameterizedContext } from "koa";
import Sale from "../models/Sale";
import * as Minio from 'minio'
import Company from "../models/Company";
import { SignedXml } from 'xml-crypto';
import { getAccessKey, getDetAndVTotTrib } from "../utils";
import { Builder, parseStringPromise } from "xml2js";

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
            // $: {
            Id: fullKey,
            versao: '4.00',
            // },
            ide: {
              cUF: company.address.cityCode.slice(0, 2),
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
  };

  const xmlString = (new Builder()).buildObject({ NFe: nfeInput.nfeDadosMsg.NFe[0] });
  const xmlSignedString = await signNfe(company.id, xmlString)

  const xmlSigned = await parseStringPromise(xmlSignedString, {
    explicitCharkey: false,
    mergeAttrs: true,
  });

  const url = 'https://localhost:3000/ws/nfeautorizacao?wsdl';

  nfeInput.nfeDadosMsg.NFe[0].infNFe = xmlSigned.NFe.infNFe[0]
  nfeInput.nfeDadosMsg.NFe[0].Signature = xmlSigned.NFe.Signature[0]

  const result = await nfe(url, xmlSigned)

  console.log(result)

  ctx.status = 200
}

export {
  pixWebhookRoute
}

async function signNfe(companyId: string, xml: string): Promise<string> {
  const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
  });

  const certificate = (await minioClient.getObject('certificates', `${companyId}-cert.pem`)).read() as Buffer
  const privateKey = (await minioClient.getObject('certificates', `${companyId}-key.pem`)).read() as Buffer

  const sig = new SignedXml({ privateKey });
  sig.publicCert = certificate
  sig.addReference({
    xpath: "//*[local-name(.)='infNFe']",
    digestAlgorithm: "http://www.w3.org/2000/09/xmldsig#sha1",
    transforms: ["http://www.w3.org/2000/09/xmldsig#enveloped-signature", "http://www.w3.org/2001/10/xml-exc-c14n#"],
  });

  sig.canonicalizationAlgorithm = "http://www.w3.org/2001/10/xml-exc-c14n#";

  sig.signatureAlgorithm = "http://www.w3.org/2000/09/xmldsig#rsa-sha1";

  sig.computeSignature(xml);

  return sig.getSignedXml();
}
