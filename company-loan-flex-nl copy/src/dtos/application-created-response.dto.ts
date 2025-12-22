import { IsIn, IsString } from "class-validator";
import {
  APPLICATION_ACCEPTED,
  APPLICATION_PENDING,
  APPLICATION_REJECTED,
} from "../constants";

export class ApplicationCreatedResponseDto {
  @IsString()
  applicationId: string;

  @IsString()
  reference: string;

  @IsString()
  organizationNumber: string;

  @IsString()
  @IsIn([APPLICATION_ACCEPTED, APPLICATION_PENDING, APPLICATION_REJECTED])
  preliminaryDecision: string;
}
