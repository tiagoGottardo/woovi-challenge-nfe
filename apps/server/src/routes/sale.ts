import { ParameterizedContext } from "koa";
import { Types } from "mongoose";
import Sale from "../schemas/Sale";
import { saleZodSchema } from "../zod/saleZodSchema";
import Product from "../schemas/Product";
import qrcode from "qrcode"
import Company from "../schemas/Company";
import { nfe, NFeAutorizacaoLoteInput } from "../examples/autorizacao";
import { request } from "http";
import { ufTocUF } from "../utils";

const saleRoute = async (ctx: ParameterizedContext) => {
  const parseResult = saleZodSchema.safeParse(ctx.request.body)

  if (parseResult.error) {
    ctx.status = 400;
    ctx.body = {
      message: 'Sale could not be registered.',
      errors: parseResult.error.issues.map(i => i.message)
    }

    return
  }

  const { companyId, pixKey, ...rest } = ctx.request.body

  const company = await Company.findOne({ _id: companyId });
  if (!company) {
    ctx.status = 400;
    ctx.body = { message: 'Sale could not be registered.' }

    return
  }

  try {
    rest.items = await Promise.all(rest.items.map(async (item: any) => {
      const product = await Product.findOne(({ _id: item.productId }))

      if (!product) throw new Error(`Product not found.`)

      item.unitPrice = product.price
      item.totalPrice = product.price * item.quantity

      return item
    }))
  } catch ({ message }: any) {
    ctx.status = 400;
    ctx.body = { message }
    return
  }

  const totalAmount = rest.items.reduce((acc: any, item: any) => acc + item.totalPrice, 0)

  const sale = new Sale({
    companyId,
    items: rest.items,
    totalAmount,
    pixKey
  })

  sale.save()

  const pixRequest = await generateQrCode(pixKey, totalAmount, company.city, company.name)

  ctx.status = 200
  ctx.body = {
    message: 'Sale registered successfully',
    data: pixRequest
  }
}

const generateQrCode = async (key: string, value: string, city: string, name: string) => {
  const payloadPix = `00020126580014BR.GOV.BCB.PIX01${key}520400005303986540${parseFloat(value).toFixed(2)}5802BR59${name}60${city}62070503***6304FC76`;

  const qrcodeBase64 = await qrcode.toDataURL(payloadPix);

  return {
    payloadPix,
    qrcodeBase64
  }
}

const pixWebhookRoute = async (ctx: ParameterizedContext) => {
  const requestBody = ctx.request.body

  const sale = await Sale.findOne({ _id: requestBody.saleId })
  if (!sale) return
  const company = await Company.findOne({ _id: sale.companyId })
  if (!company) return

  console.log()
  const accessKey = getAccessKey(ufTocUF(company.state) || "41", company.cnpj, 1, (company._id as Types.ObjectId).toString())
  if (!accessKey) return

  const { fullKey, cDV } = accessKey

  const args: NFeAutorizacaoLoteInput = {
    nfeDadosMsg: {
      idLote: '000000000000001',
      indSinc: '1',
      NFe: [
        {
          infNFe: {
            Id: fullKey,
            versao: '4.00',
            ide: {
              cUF: ufTocUF(company.state),
              cNF: (company._id as Types.ObjectId).toString(),
              natOp: 'VENDA DE MERCADORIA ADQUIRIDA OU RECEBIDA DE TERCEIROS', // Natureza da Operação adequada para NFC-e
              mod: '65',
              serie: '1',
              nNF: '1', // Número da NFC-e (sequencial, gerado pelo emitente)
              dhEmi: (new Date(Date.now()).toString()),
              tpNF: '1',
              idDest: '1',
              cMunFG: '4106902', // Código do Município de ocorrência do fato gerador (Ponta Grossa, PR)
              tpImp: '4',
              tpEmis: '1',
              cDV, // **** CRÍTICO: Dígito Verificador da Chave de Acesso (DEVE SER CALCULADO!) ****
              tpAmb: '1',
              finNFe: '1',
              indFinal: '1',
              indPres: '1', // **** CRÍTICO: Indicador de Presença (1=Operação presencial) ****
              procEmi: '0',
              verProc: 'WOOVI_V1.0', // Versão do processo de emissão (seu software)
              idCSC: 'SEU_ID_CSC_AQUI', // **** CRÍTICO: Identificador do CSC (Código de Segurança do Contribuinte) ****
              CSC: 'SEU_CODIGO_CSC_AQUI' // **** CRÍTICO: O Código de Segurança do Contribuinte (Token) ****
            },
            emit: {
              CNPJ: company.cnpj,
              xNome: company.name,
              xFant: company.name,
              enderEmit: {
                xLgr: company.address, // Logradouro
                nro: '123', // Número
                xBairro: 'CENTRO', // Bairro
                cMun: '4106902', // Código IBGE do município do emitente (Ponta Grossa, PR)
                xMun: 'PONTA GROSSA', // Nome do município
                UF: company.state, // UF do emitente
                CEP: '80000000', // CEP do emitente
                cPais: '1058',
                xPais: 'BRASIL',
                fone: '4133333333' // Telefone do emitente
              },
              IE: '9999999999', // Inscrição Estadual do emitente
              CRT: '1'
            },
            det: [{
              nItem: '1', // Número sequencial do item
              prod: {
                cProd: 'PROD001', // Código interno do produto
                cEAN: 'SEM GTIN', // GTIN (EAN) do produto. Se não tiver, usar 'SEM GTIN'
                xProd: 'PRODUTO TESTE', // Descrição do produto
                NCM: '00000000', // NCM do produto
                CFOP: '5102', // CFOP (Código Fiscal de Operações e Prestações) para venda dentro do estado
                uCom: 'UN', // Unidade Comercial
                qCom: '1.0000', // Quantidade Comercial
                vUnCom: '10.00', // Valor Unitário Comercial
                vProd: '10.00', // Valor Total do Produto (qCom * vUnCom)
                cEANTrib: 'SEM GTIN', // GTIN (EAN) da unidade tributável. Usar 'SEM GTIN'
                uTrib: 'UN', // Unidade Tributável
                qTrib: '1.0000', // Quantidade Tributável
                vUnTrib: '10.00', // Valor Unitário Tributável
                indTot: '1' // Indica se valor do item compõe o valor total da NFC-e (1=compõe)
              },
              imposto: {
                // **** AJUSTE PARA CSOSN se CRT for '1' (Simples Nacional) ****
                ICMS: {
                  ICMSSN102: { // Exemplo de CSOSN: Simples Nacional - Tributado sem permissão de crédito
                    orig: '0', // Origem da mercadoria (0=Nacional)
                    CSOSN: '102' // Código de Situação da Operação no Simples Nacional
                  }
                },
                PIS: {
                  PISNT: { // PIS - Não Tributado (pode vaNomenclaturas	riar conforme a regra da sua empresa/produto)
                    CST: '07' // Código de Situação Tributária do PIS
                  }
                },
                COFINS: {
                  COFINSNT: { // COFINS - Não Tributado (pode variar conforme a regra da sua empresa/produto)
                    CST: '07' // Código de Situação Tributária da COFINS
                  }
                }
              }
            }],
            total: {
              ICMSTot: {
                vBC: '0.00', // Base de Cálculo do ICMS (geralmente 0.00 para Simples Nacional)
                vICMS: '0.00', // Valor do ICMS (geralmente 0.00 para Simples Nacional)
                vICMSDeson: '0.00', // Valor ICMS desonerado
                vFCP: '0.00', // Valor do Fundo de Combate à Pobreza
                vBCST: '0.00', // Base de Cálculo do ICMS ST
                vST: '0.00', // Valor do ICMS ST
                vFCPST: '0.00', // Valor do FCP ST
                vFCPSTRet: '0.00', // Valor do FCP ST retido
                vProd: '10.00', // Valor Total dos Produtos
                vFrete: '0.00', // Valor Total do Frete
                vSeg: '0.00', // Valor Total do Seguro
                vDesc: '0.00', // Valor Total do Desconto
                vII: '0.00', // Valor do Imposto de Importação
                vIPI: '0.00', // Valor do IPI
                vIPIDevol: '0.00', // Valor do IPI devolvido
                vPIS: '0.00', // Valor do PIS
                vCOFINS: '0.00', // Valor da COFINS
                vOutro: '0.00', // Outras Despesas Acessórias
                vNF: '10.00', // Valor Total da NFC-e (o valor final da nota)
                vTotTrib: '0.00' // **** CRÍTICO: Valor Aproximado Total de Tributos (DEVE SER CALCULADO!) ****
              }
            },
            transp: {
              modFrete: '9'
            },
            pag: {
              detPag: [{
                indPag: '0',
                tPag: '16',
                vPag: '10.00' // Valor do pagamento
              }]
            }
          },
          Signature: {} // Este bloco será preenchido pelo seu certificado digital antes do envio para a Sefaz
        }
      ]
    }
  };

  const result = await nfe("https://localhost:3000/ws/nfeautorizacao?wsdl", args)
  console.log(result)

  ctx.status = 200
  ctx.body = { message: "Ok!" }
}

const getAccessKey = (cUF: string, cnpj: string, nNF: number, cNF: string) => {
  const now = new Date(Date.now());
  const year = now.getFullYear().toString().slice(2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');

  const yearMonth = year + month
  const serie = '1'.padStart(3, '0')
  const nNFf = nNF.toString().padStart(9, '0');
  const cNFf = cNF.padStart(8, '0');

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
    if (weight > 9) { // Reseta o peso para 2 após 9
      weight = 2;
    }
  }

  let rest = sum % 11;
  let cDV = 11 - rest;

  if (cDV === 10 || cDV === 11) { cDV = 0; }

  return {
    fullKey: first43Digits + cDV,
    cDV: cDV.toString()
  }
}

export { saleRoute, pixWebhookRoute }
