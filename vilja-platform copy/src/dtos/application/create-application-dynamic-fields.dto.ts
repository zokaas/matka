import { IsObject } from "class-validator";
import { CreateApplicationDto } from "./create-application.dto";

export class CreateApplicationDynamicFieldsDto extends CreateApplicationDto {
  @IsObject()
  dynamicFields: Record<string, unknown>;
}
