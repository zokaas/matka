import { Type } from "class-transformer";
import { IsNotEmpty, IsObject } from "class-validator";
import { ContentfulResponseDto } from "src/contentful/dto/contentfulResponse.dto";
import { PageIncludesDto } from "./pageIncludes.dto";

export class PageDataDto {
    @IsObject()
    @IsNotEmpty()
    data: Object;

    @IsObject()
    @Type(() => PageIncludesDto)
    includes?: PageIncludesDto;

    @IsObject()
    @IsNotEmpty()
    @Type(() => ContentfulResponseDto)
    translationObj: ContentfulResponseDto;
}
