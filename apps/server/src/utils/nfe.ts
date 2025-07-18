import * as soap from 'soap'
import { getMinioClient } from '../config'
import qrcode from 'qrcode'
import https from 'https'
import { ISaleItem } from '../models/Sale'
import Product from '../models/Product'

import { NFeAutorizacaoLoteInput, RetEnviNFeOutput } from './sefazTypes'
import { SignedXml } from 'xml-crypto'

export const emitNFCe = async (url: string, xml: NFeAutorizacaoLoteInput, companyId: string) => {
  const minioClient = getMinioClient()

  const cert = (await minioClient.getObject('certificates', `${companyId}-cert.pem`)).read() as Buffer
  const key = (await minioClient.getObject('certificates', `${companyId}-key.pem`)).read() as Buffer

  const agent = new https.Agent({
    key, cert,
    rejectUnauthorized: false,
  })

  const soapOptions = {
    overrideRootElement: {
      namespace: 'nfe',
      xmlnsAttributes: [{
        name: 'xmlns',
        value: 'http://www.portalfiscal.inf.br/nfe'
      }],
    },
    ignoredNamespaces: {
      namespaces: ['nfe']
    },
    agent,
  }

  try {
    const client = await soap.createClientAsync(url, soapOptions)
    const [result] = await client.nfeAutorizacaoLoteAsync(xml) as [RetEnviNFeOutput]

    return result
  } catch (error: any) {
    console.error('Erro ao enviar requisição SOAP:', error)
    return null
  }
}

export const signNfe = async (companyId: string, xml: string): Promise<string> => {
  const minioClient = getMinioClient()

  const certificate = (await minioClient.getObject('certificates', `${companyId}-cert.pem`)).read() as Buffer
  const privateKey = (await minioClient.getObject('certificates', `${companyId}-key.pem`)).read() as Buffer

  const sig = new SignedXml({ privateKey })
  sig.publicCert = certificate
  sig.addReference({
    xpath: "//*[local-name(.)='infNFe']",
    digestAlgorithm: "http://www.w3.org/2000/09/xmldsig#sha1",
    transforms: ["http://www.w3.org/2000/09/xmldsig#enveloped-signature", "http://www.w3.org/2001/10/xml-exc-c14n#"],
  })

  sig.canonicalizationAlgorithm = "http://www.w3.org/2001/10/xml-exc-c14n#"

  sig.signatureAlgorithm = "http://www.w3.org/2000/09/xmldsig#rsa-sha1"

  sig.computeSignature(xml)

  return sig.getSignedXml()
}

export const getIbptTax = async (ncm: string, uf: string) => {
  try {
    const res = await fetch(`http://ibpt.nfe.io/ncm/${uf.toLowerCase()}/${ncm}.json`)
    const { federalNationalRate, federalImportedRate, stateRate, municipalRate } = await res.json()
    return (federalNationalRate + federalImportedRate + stateRate + municipalRate) / 100
  }
  catch (_) {
    return null
  }
}

export const getDetAndVTotTrib = async (items: ISaleItem[], interStateSale: boolean) => {
  let vTotTrib = 0
  const det = items.map(async (e, i) => {
    const product = await Product.findById(e.productId)
    if (!product) throw new Error("Product not found!")

    vTotTrib += (e.quantity * e.unitPrice * product.ibptTax)

    return {
      nItem: (i + 1).toString(),
      prod: {
        cProd: e.productId,
        cEAN: 'SEM GTIN',
        xProd: product?.description,
        NCM: product.ncm,
        CFOP: (interStateSale ? '6' : '5') + '102',
        uCom: product.unitOfMeasure,
        qCom: e.quantity.toFixed(4),
        vUnCom: e.unitPrice.toFixed(10),
        vProd: (e.quantity * e.unitPrice).toFixed(2),
        cEANTrib: 'SEM GTIN',
        uTrib: product.unitOfMeasure,
        qTrib: e.quantity.toFixed(4),
        vUnTrib: e.unitPrice.toFixed(10),
        indTot: '0'
      },
      imposto: {
        ICMS: { ICMSSN102: { orig: '0', CSOSN: '102' } },
        PIS: { PISNT: { CST: '07' } },
        COFINS: { COFINSNT: { CST: '07' } }
      }
    }
  })

  return { det, vTotTrib: vTotTrib.toFixed(2) }
}

export const getAccessKey = (cUF: string, cnpj: string, nNF: number, cNF: string) => {
  const now = new Date(Date.now())
  const year = now.getFullYear().toString().slice(2)
  const month = (now.getMonth() + 1).toString().padStart(2, '0')

  const yearMonth = year + month
  const serie = '1'.padStart(3, '0')
  const nNFf = nNF.toString().slice(0, 9).padStart(9, '0')
  const cNFf = cNF.slice(0, 8).padStart(8, '0')

  const first43Digits =
    cUF +
    yearMonth +
    cnpj +
    '65' +
    serie +
    nNFf +
    '1' +
    cNFf

  if (first43Digits.length !== 43) return null

  let sum = 0
  let weight = 2
  const reverseKey = first43Digits.split('').reverse().join('')

  for (let i = 0; i < reverseKey.length; i++) {
    sum += parseInt(reverseKey[i]) * weight
    weight++
    if (weight > 9) weight = 2
  }

  let rest = sum % 11
  let cDV = 11 - rest

  if (cDV === 10 || cDV === 11) { cDV = 0 }

  return {
    fullKey: first43Digits + cDV.toString(),
    cDV: cDV.toString()
  }
}

export const generateQrCode = async (key: string, value: string, city: string, name: string) => {
  const payloadPix = `00020126580014BR.GOV.BCB.PIX01${key}520400005303986540${parseFloat(value).toFixed(2)}5802BR59${name}60${city}62070503***6304FC76`

  const qrcodeBase64 = await qrcode.toDataURL(payloadPix)

  return {
    payloadPix,
    qrcodeBase64
  }
}
