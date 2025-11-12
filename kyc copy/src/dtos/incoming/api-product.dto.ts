import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";
import {
  ButtonDto,
  CompanyBlockDto,
  FooterDto,
  SessionModalDto,
  StepsDto,
} from "../shared";
import { KycReferenceDto } from "./kyc-reference.dto";

export class ApiProductDto {
  @IsNumber()
  id: number;

  @IsString()
  documentId: string;

  @IsString()
  product: string;

  @ValidateNested()
  @Type(() => StepsDto)
  steps: StepsDto;

  @ValidateNested()
  @Type(() => ButtonDto)
  button: ButtonDto;

  @ValidateNested()
  @Type(() => FooterDto)
  footer: FooterDto;

  @ValidateNested()
  @Type(() => CompanyBlockDto)
  companyBlock: CompanyBlockDto;

  @ValidateNested()
  @Type(() => SessionModalDto)
  sessionModal: SessionModalDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KycReferenceDto)
  kyc_ses: KycReferenceDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KycReferenceDto)
  kyc_fis: KycReferenceDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KycReferenceDto)
  kyc_nls: KycReferenceDto[];

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsString()
  publishedAt: string;
}
