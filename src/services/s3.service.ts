import { randomUUID } from "node:crypto";
import path from "node:path";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { UploadedFile } from "express-fileupload";

import { config } from "../configs/config";
import { EFileItemType } from "../enums/file-item-type.enum";

class S3Service {
  constructor(
    private readonly client = new S3Client({
      region: config.AWS_S3_REGION,
      credentials: {
        accessKeyId: config.AWS_S3_ACCESS_KEY,
        secretAccessKey: config.AWS_S3_SECRET_ACCESS_KEY,
      },
    }),
  ) {}

  public async uploadFile(
    file: UploadedFile,
    itemType: EFileItemType,
    itemId: string,
  ): Promise<string> {
    try {
      const path = this.buildPath(itemType, itemId, file.name);
      await this.client.send(
        new PutObjectCommand({
          Bucket: config.AWS_S3_BUCKET_NAME,
          Body: file.data,
          Key: path,
          ACL: "public-read",
        }),
      );
      return path;
    } catch (e) {
      console.error("Upload file error: ", e);
    }
  }
  private buildPath(
    itemType: string,
    itemId: string,
    fileName: string,
  ): string {
    //user/mongoId/randomId.jpg
    return `${itemType}/${itemId}/${randomUUID()}${path.extname(fileName)}`;
  }
}

export const s3Service = new S3Service();
