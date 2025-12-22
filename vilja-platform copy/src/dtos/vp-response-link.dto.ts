import { IsOptional, IsString } from "class-validator";

export class LinkDto {
  @IsString()
  @IsOptional()
  href: string;
}
