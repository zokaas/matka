import { IsString } from "class-validator";

export class SessionResponseDto {
  @IsString()
  sessionId: string;
}
