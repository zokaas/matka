import { IsString } from "class-validator";

export class RequestConfigHeadersDto {
  @IsString()
  "Content-Type": string;

  @IsString()
  Authorization: string;
}
