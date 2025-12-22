import { IsArray, IsNumber, IsString } from "class-validator";

export class NlPostCodeLocationDto {
  @IsString()
  type: string;

  @IsArray({ each: true })
  @IsNumber()
  coordinates: Array<number>;
}
