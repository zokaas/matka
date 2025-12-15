import { IsIn, IsNotEmpty, IsString } from "class-validator";

const sources = ["b2b", "b2c"];
const languages = ["fi"];
const products = ["yritysluotto"];
const types = ["statement"];

export class ViewMetaDto {
    @IsString()
    @IsNotEmpty()
    @IsIn(sources)
    source: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(languages)
    lang: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(products)
    product: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(types)
    type: string;
}
