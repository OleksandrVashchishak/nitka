"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const cloudinary_1 = require("cloudinary");
let UploadsService = class UploadsService {
    constructor() {
        this.uploadDir = (0, path_1.join)(process.cwd(), 'uploads');
        if (!(0, fs_1.existsSync)(this.uploadDir)) {
            (0, fs_1.mkdirSync)(this.uploadDir, { recursive: true });
        }
        if (this.cloudinaryEnabled) {
            cloudinary_1.v2.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
                secure: true,
            });
        }
    }
    get cloudinaryEnabled() {
        return Boolean(process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_SECRET);
    }
    async uploadImage(file) {
        if (this.cloudinaryEnabled) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary_1.v2.uploader.upload_stream({
                    folder: process.env.CLOUDINARY_FOLDER || 'nitka/vendors',
                    resource_type: 'image',
                }, (err, uploaded) => {
                    if (err || !uploaded) {
                        reject(err ?? new Error('Cloudinary upload failed'));
                        return;
                    }
                    resolve(uploaded);
                });
                stream.end(file.buffer);
            });
            return { url: result.secure_url, provider: 'cloudinary' };
        }
        const ext = this.extensionFromMime(file.mimetype);
        const filename = `${Date.now()}-${(0, crypto_1.randomUUID)()}${ext}`;
        const fullPath = (0, path_1.join)(this.uploadDir, filename);
        await (0, promises_1.writeFile)(fullPath, file.buffer);
        const base = process.env.PUBLIC_API_URL?.replace(/\/$/, '') ||
            `http://localhost:${process.env.PORT || 3001}`;
        return {
            url: `${base}/api/uploads/files/${filename}`,
            provider: 'local',
        };
    }
    openLocalFile(filename) {
        const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '');
        const fullPath = (0, path_1.join)(this.uploadDir, safe);
        if (!(0, fs_1.existsSync)(fullPath) || !fullPath.startsWith(this.uploadDir)) {
            return null;
        }
        return (0, fs_1.createReadStream)(fullPath);
    }
    extensionFromMime(mime) {
        if (mime === 'image/png')
            return '.png';
        if (mime === 'image/webp')
            return '.webp';
        if (mime === 'image/gif')
            return '.gif';
        return '.jpg';
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map