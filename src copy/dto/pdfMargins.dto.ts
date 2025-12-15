import { IsOptional, IsString } from "class-validator";

export class PdfMarginsDto {
    @IsString()
    @IsOptional()
    top?: string;

    @IsString()
    @IsOptional()
    right?: string;

    @IsString()
    @IsOptional()
    bottom?: string;

    @IsString()
    @IsOptional()
    left?: string;
}
