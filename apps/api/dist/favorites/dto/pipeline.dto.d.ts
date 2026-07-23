import { VendorPipelineStage } from '@prisma/client';
export declare class UpdatePipelineDto {
    stage?: VendorPipelineStage;
    quotedPrice?: number | null;
    notes?: string | null;
}
export declare class CreateExternalVendorDto extends UpdatePipelineDto {
    name: string;
    category: string;
    city?: string;
    phone?: string;
    website?: string;
}
export declare class UpdateExternalVendorDto extends UpdatePipelineDto {
    name?: string;
    category?: string;
    city?: string;
    phone?: string | null;
    website?: string | null;
}
