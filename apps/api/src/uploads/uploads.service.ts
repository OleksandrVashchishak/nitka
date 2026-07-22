import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { createReadStream, existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

export type UploadResult = {
  url: string;
  provider: 'cloudinary' | 'local';
};

type UploadFile = {
  buffer: Buffer;
  mimetype: string;
  originalname?: string;
  size?: number;
};

@Injectable()
export class UploadsService {
  private readonly uploadDir = join(process.cwd(), 'uploads');

  constructor() {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }

    if (this.cloudinaryEnabled) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      });
    }
  }

  get cloudinaryEnabled() {
    return Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET,
    );
  }

  async uploadImage(file: UploadFile): Promise<UploadResult> {
    if (this.cloudinaryEnabled) {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: process.env.CLOUDINARY_FOLDER || 'nitka/vendors',
            resource_type: 'image',
          },
          (
            err: UploadApiErrorResponse | undefined,
            uploaded: UploadApiResponse | undefined,
          ) => {
            if (err || !uploaded) {
              reject(err ?? new Error('Cloudinary upload failed'));
              return;
            }
            resolve(uploaded);
          },
        );
        stream.end(file.buffer);
      });

      return { url: result.secure_url, provider: 'cloudinary' };
    }

    const ext = this.extensionFromMime(file.mimetype);
    const filename = `${Date.now()}-${randomUUID()}${ext}`;
    const fullPath = join(this.uploadDir, filename);
    await writeFile(fullPath, file.buffer);

    const base =
      process.env.PUBLIC_API_URL?.replace(/\/$/, '') ||
      `http://localhost:${process.env.PORT || 3001}`;

    return {
      url: `${base}/api/uploads/files/${filename}`,
      provider: 'local',
    };
  }

  openLocalFile(filename: string) {
    const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '');
    const fullPath = join(this.uploadDir, safe);
    if (!existsSync(fullPath) || !fullPath.startsWith(this.uploadDir)) {
      return null;
    }
    return createReadStream(fullPath);
  }

  private extensionFromMime(mime: string) {
    if (mime === 'image/png') return '.png';
    if (mime === 'image/webp') return '.webp';
    if (mime === 'image/gif') return '.gif';
    return '.jpg';
  }
}
