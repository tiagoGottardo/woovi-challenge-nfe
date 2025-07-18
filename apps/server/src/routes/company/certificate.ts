import fs from 'fs'
import pem from 'pem'
import { ParameterizedContext } from "koa"
import formidable from 'formidable'
import Company from '../../models/Company'
import { getMinioClient } from '../../config'

const certificateRoute = async (ctx: ParameterizedContext) => {
  const companyId = ctx.params.id
  const password = ctx.request.body.password
  if (!password) {
    ctx.status = 400
    ctx.request.body = { message: "Password is required!" }
    return
  }

  const exists = await Company.exists({ _id: companyId })
  if (!exists) {
    ctx.status = 400
    ctx.request.body = { message: "Company not found!" }
    return
  }

  try {
    const minioClient = getMinioClient()

    const bucketExists = await minioClient.bucketExists('certificates')
    if (!bucketExists)
      await minioClient.makeBucket('certificates', 'us-east-1')

    const file = ctx.request.files?.file as formidable.File | undefined
    if (!file) {
      ctx.status = 400
      ctx.body = { message: 'File not found.' }
      return
    }

    const parts = file.originalFilename?.split(".")
    if (!parts || parts[parts?.length - 1] != "pfx") {
      ctx.status = 400
      ctx.body = { message: 'The file needs to has pxf extension' }
      return
    }

    const pemFiles = await getPemFiles(file.filepath, password)
    if (!pemFiles) {
      ctx.status = 400
      ctx.body = { message: 'Pfx file is invalid or password is wrong.' }
      return
    }

    const { cert, key } = pemFiles

    const certBuffer = Buffer.from(cert, 'utf8')
    await minioClient.putObject('certificates', `${companyId}-cert.pem`, certBuffer, certBuffer.length, {})

    const keyBuffer = Buffer.from(key, 'utf8')
    await minioClient.putObject('certificates', `${companyId}-key.pem`, keyBuffer, keyBuffer.length, {})

    fs.unlink(file.filepath, (err) => {
      if (err) console.error(`Error on remove temp file: ${err.message}`)
    })

    ctx.status = 200
    ctx.body = {
      message: 'Certificate uploaded successfully!',
    }

  } catch (error) {
    ctx.status = 500
    console.log(error)
    ctx.body = { message: 'Internal Server Error on upload certificate.' }
  }
}

const getPemFiles = (filepath: string, p12Password: string): Promise<{ cert: string; key: string } | null> => {
  const pfxBuffer = fs.readFileSync(filepath)

  return new Promise((resolve, _) => {
    pem.readPkcs12(pfxBuffer, { p12Password }, (err, { cert, key }) => {
      if (err || !cert || !key) return resolve(null)
      resolve({ cert, key })
    })
  })
}

export { certificateRoute }
