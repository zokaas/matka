import { IsObject } from "class-validator";

export class ContentfulResponseDto {
    @IsObject()
    media: Object;
}
