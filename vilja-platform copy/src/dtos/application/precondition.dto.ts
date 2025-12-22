import { IsBoolean, IsString } from "class-validator";

export class PreconditionDto {
  @IsString()
  id: string;

  @IsString()
  preconditionName: string;

  @IsBoolean()
  mandatory: boolean;

  @IsString()
  complementType: string;

  @IsBoolean()
  external: boolean;

  @IsString()
  preconditionTarget: string;

  @IsString()
  stateUpdateTime: string;

  @IsString()
  state: string;

  @IsString()
  shortName: string;
}
