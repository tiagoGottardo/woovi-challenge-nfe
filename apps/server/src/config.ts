import path from 'path';
import * as https from 'https';
import { readFileSync } from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const key = readFileSync(path.resolve(__dirname, '../certs/client.key'));
const cert = readFileSync(path.resolve(__dirname, '../certs/client.crt'));
const ca = readFileSync(path.resolve(__dirname, '../certs/ca.crt'));

const agent = new https.Agent({
  key, cert, ca,
  rejectUnauthorized: false,
});

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
};

dotenv.config();

const mongoURI: string = process.env.MONGO_URI || 'mongodb://localhost:27017/challenge';
const PORT = process.env.PORT || 4000;

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected successfully!');
  } catch (err: any) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

export {
  soapOptions,
  PORT
}
