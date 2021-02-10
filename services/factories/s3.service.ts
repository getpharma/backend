import logger from "../../util/logger.util";
import AWS from "aws-sdk";
import { ENV_S3_BUCKET, ENV_S3_KEY, ENV_S3_SECRET } from "../../util/secrets.util";


class S3Service {

  constructor() {
    logger.silly("[N-IP] S3Service");
  }

  static getInstance(): S3Service {
    return new S3Service();
  }

  async uploadToS3(buffer: Buffer, fileName: string, type: string) {
    const s3bucket: any = new AWS.S3({
      accessKeyId    : ENV_S3_KEY,
      secretAccessKey: ENV_S3_SECRET
    });

    const params = {
      ACL   : "public-read",
      Bucket: ENV_S3_BUCKET,
      Key   : type + "/" + fileName,
      Body  : buffer
    };


    await s3bucket.upload(params, function (err: any, data: any) {
      if (err) {
        throw err;
      }
    });
  }
}

export const s3Service = S3Service.getInstance();



