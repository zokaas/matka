import { IsOptional, IsString } from "class-validator";
import { DynamicFieldDto } from "./dynamic-field.dto";

export class InfoDto extends DynamicFieldDto {
  @IsString()
  __component: "kyc.info";

  @IsOptional()
  @IsString()
  componentType?: string;

  @IsOptional()
  @IsString()
  infoHeader?: string;

  @IsOptional()
  @IsString()
  infoDescription?: string;
}
