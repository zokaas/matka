import { IsNotEmpty, IsString } from "class-validator";

export class PageIncludesDto {
    @IsNotEmpty()
    @IsString()
    css: string;
}
