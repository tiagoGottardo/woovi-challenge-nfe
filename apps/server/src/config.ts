import * as Minio from 'minio'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

dotenv.config()

export const config = {
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT || 'localhost',
  MINIO_PORT: parseInt(process.env.MINIO_PORT || '9000'),
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY || 'minioadmin',
  PORT: parseInt(process.env.PORT || "4000"),
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/challenge'
}

export const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI)
    console.log('MongoDB Connected successfully!')
  } catch (err: any) {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  }
}

let minioClient: Minio.Client | undefined
export const getMinioClient = () => {
  if (!minioClient) {
    minioClient = new Minio.Client({
      endPoint: config.MINIO_ENDPOINT,
      port: config.MINIO_PORT,
      useSSL: false,
      accessKey: config.MINIO_ACCESS_KEY,
      secretKey: config.MINIO_SECRET_KEY,
    })
  }

  return minioClient
}
