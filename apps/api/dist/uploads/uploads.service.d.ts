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
export declare class UploadsService {
    private readonly uploadDir;
    constructor();
    get cloudinaryEnabled(): boolean;
    uploadImage(file: UploadFile): Promise<UploadResult>;
    openLocalFile(filename: string): import("fs").ReadStream | null;
    private extensionFromMime;
}
export {};
