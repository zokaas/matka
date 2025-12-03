import { Module } from "@nestjs/common";
import { StrapiService } from "./strapi.service";
import { StrapiController } from "./strapi.controller";
import { HttpModule } from "@nestjs/axios";
import { LoggerModule } from "@opr-finance/logger";

@Module({
  imports: [HttpModule, LoggerModule],
  providers: [StrapiService],
  exports: [StrapiService],
  controllers: [StrapiController],
})
export class StrapiModule {}
