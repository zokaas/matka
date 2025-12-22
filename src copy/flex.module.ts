import { Module } from '@nestjs/common';
import { FlexService } from './flex.service';
import { FlexController } from './flex.controller';
@Module({
  providers: [FlexService],
  exports: [FlexService],
  controllers: [FlexController],
})
export class FlexModule {}
