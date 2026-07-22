import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';
import type { Response } from 'express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { UploadsService } from './uploads.service';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE, Role.VENDOR, Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_BYTES },
    }),
  )
  async upload(
    @UploadedFile()
    file?: {
      buffer: Buffer;
      mimetype: string;
      originalname: string;
      size: number;
    },
  ) {
    if (!file) {
      throw new BadRequestException('Файл не передано');
    }
    if (!ALLOWED.has(file.mimetype)) {
      throw new BadRequestException('Дозволені лише JPEG, PNG, WebP, GIF');
    }

    return this.uploadsService.uploadImage({
      buffer: file.buffer,
      mimetype: file.mimetype,
      originalname: file.originalname,
      size: file.size,
    });
  }

  @Get('files/:filename')
  async serveFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const stream = this.uploadsService.openLocalFile(filename);
    if (!stream) {
      res.status(404).json({ message: 'Файл не знайдено' });
      return;
    }

    if (filename.endsWith('.png')) res.type('image/png');
    else if (filename.endsWith('.webp')) res.type('image/webp');
    else if (filename.endsWith('.gif')) res.type('image/gif');
    else res.type('image/jpeg');

    stream.pipe(res);
  }
}
