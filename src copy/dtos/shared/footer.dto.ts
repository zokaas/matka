import { IsString } from "class-validator";

export class FooterDto {
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
