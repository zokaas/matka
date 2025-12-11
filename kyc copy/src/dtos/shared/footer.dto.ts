import { IsNumber, IsOptional, IsString } from "class-validator";

export class FooterDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  customerServiceLabel: string;

  @IsString()
  customerServiceText: string;

  @IsString()
  contactInfoLabel: string;

  @IsString()
  contactInfoText: string;

  @IsString()
  addressLabel: string;

  @IsString()
  addressText: string;
}
