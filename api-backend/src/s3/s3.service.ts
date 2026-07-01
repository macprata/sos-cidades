import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  // Manter sua função de upload existente
  async uploadFile(file: Express.Multer.File, key: string) {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    await this.s3.send(command);
    return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
  }

  // Mude de Promise<string> para Promise<string | null>
  async gerarUrlTemporaria(urlSalvaNoBanco: string): Promise<string | null> {
    if (!urlSalvaNoBanco) return null; // Agora o TypeScript permite isso

    try {
      const key = urlSalvaNoBanco.split('.com/')[1];

      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      });

      return await getSignedUrl(this.s3, command, { expiresIn: 3600 });
    } catch (error) {
      console.error('Erro ao assinar URL:', error);
      return null; // Agora o TypeScript permite isso também
    }
  }
}
