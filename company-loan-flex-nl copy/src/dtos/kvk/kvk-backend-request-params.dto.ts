import { IsOptional, IsString, Validate } from "class-validator";
import { CustomKvkRequestParamValidator } from "../../helpers";
import { IS_KVK_NAME, IS_KVK_NUMBER } from "../../constants";

export class KvkBackendRequestParamsDto {
  @IsString()
  @IsOptional()
  @Validate(CustomKvkRequestParamValidator)
  [IS_KVK_NAME]?: string;

  @IsString()
  @IsOptional()
  @Validate(CustomKvkRequestParamValidator)
  [IS_KVK_NUMBER]?: string;
}
