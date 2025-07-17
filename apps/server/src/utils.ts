import jwt from 'jsonwebtoken'
import qrcode from 'qrcode'
import { ISaleItem } from './models/Sale'
import Product from './models/Product'

const JWT_SECRET = process.env.JWT_SECRET || "secret"

export interface UserPayload {
  id: string;
  email: string;
}

export const generateToken = (payload: UserPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '90d' });
};

export const verifyToken = (token: string): UserPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const getDetAndVTotTrib = async (items: ISaleItem[], interStateSale: boolean) => {
  let vTotTrib = 0;
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
  const now = new Date(Date.now());
  const year = now.getFullYear().toString().slice(2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');

  const yearMonth = year + month
  const serie = '1'.padStart(3, '0')
  const nNFf = nNF.toString().slice(0, 9).padStart(9, '0');
  const cNFf = cNF.slice(0, 8).padStart(8, '0');

  const first43Digits =
    cUF +
    yearMonth +
    cnpj +
    '65' +
    serie +
    nNFf +
    '1' +
    cNFf;

  if (first43Digits.length !== 43) return null

  let sum = 0;
  let weight = 2;
  const reverseKey = first43Digits.split('').reverse().join('');

  for (let i = 0; i < reverseKey.length; i++) {
    sum += parseInt(reverseKey[i]) * weight;
    weight++;
    if (weight > 9) weight = 2;
  }

  let rest = sum % 11;
  let cDV = 11 - rest;

  if (cDV === 10 || cDV === 11) { cDV = 0; }

  return {
    fullKey: first43Digits + cDV.toString(),
    cDV: cDV.toString()
  }
}

export const generateQrCode = async (key: string, value: string, city: string, name: string) => {
  const payloadPix = `00020126580014BR.GOV.BCB.PIX01${key}520400005303986540${parseFloat(value).toFixed(2)}5802BR59${name}60${city}62070503***6304FC76`;

  const qrcodeBase64 = await qrcode.toDataURL(payloadPix);

  return {
    payloadPix,
    qrcodeBase64
  }
}

