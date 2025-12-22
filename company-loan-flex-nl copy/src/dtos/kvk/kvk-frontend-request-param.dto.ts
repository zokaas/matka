import { IsString } from "class-validator";

export class KvkFrontendRequestParamDto {
  @IsString()
  q: string;
}
