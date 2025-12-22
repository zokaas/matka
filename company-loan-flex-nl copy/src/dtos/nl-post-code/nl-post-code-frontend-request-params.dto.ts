import { IsString } from "class-validator";

export class NlPostCodeFrontendRequestParamsDto {
  @IsString()
  postalCode: string;

  @IsString()
  number: string;
}
