import { IsString, ValidateNested } from "class-validator";
import { OfficialAddressDto } from "./official-address.dto";

export class UpdateProfileDto {
  @IsString()
  email: string;

  @IsString()
  phone: string;

  @ValidateNested()
  officalAddress: OfficialAddressDto;
}
