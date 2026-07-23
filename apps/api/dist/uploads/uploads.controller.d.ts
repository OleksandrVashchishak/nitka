import type { Response } from 'express';
import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    upload(file?: {
        buffer: Buffer;
        mimetype: string;
        originalname: string;
        size: number;
    }): Promise<import("./uploads.service").UploadResult>;
    serveFile(filename: string, res: Response): Promise<void>;
}
