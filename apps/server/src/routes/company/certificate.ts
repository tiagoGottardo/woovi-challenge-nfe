import * as Minio from 'minio';
import fs from 'fs'
import { ParameterizedContext } from "koa";
import formidable from 'formidable'
import Company from '../../models/Company';

const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin'
});

const certificateRoute = async (ctx: ParameterizedContext) => {
  const companyId = ctx.params.id;

  const exists = await Company.exists({ _id: companyId });
  if (!exists) {
    ctx.status = 400
    ctx.request.body = { message: "Company not found!" }
    return
  }

  try {
    const bucketExists = await minioClient.bucketExists('certificates');
    if (!bucketExists)
      await minioClient.makeBucket('certificates', 'us-east-1');


    const file = ctx.request.files?.file as formidable.File | undefined
    if (!file) {
      ctx.status = 400;
      ctx.body = { message: 'File not found.' };
      return;
    }

    const filePath = file.filepath;
    const minioObjectName = companyId;

    await minioClient.fPutObject('certificates', minioObjectName, filePath, {});

    fs.unlink(filePath, (err) => {
      if (err) console.error(`Error on remove temp file: ${err.message}`)
    });

    ctx.status = 200;
    ctx.body = {
      message: 'Certificate uploaded successfully!',
    };

  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: 'Internal Server Error on upload certificate.', error };
  }
}

export { certificateRoute }
