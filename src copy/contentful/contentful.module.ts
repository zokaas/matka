import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ContentfulService } from "./contentful.service";

@Module({
    imports: [HttpModule],
    providers: [ContentfulService],
    exports: [ContentfulService],
})
export class ContentfulModule {}
