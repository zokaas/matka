import { Type } from "class-transformer";
import { IsNotEmpty, IsObject } from "class-validator";
import { PageDataDto } from "./pageData.dto";
import { ViewMetaDto } from "./viewMeta.dto";

export class TemplateDataDto {
    // sourceInfo
    @IsNotEmpty()
    @Type(() => ViewMetaDto)
    sourceInfo: ViewMetaDto;

    @IsNotEmpty()
    @Type(() => PageDataDto)
    templateProps: PageDataDto;
}
