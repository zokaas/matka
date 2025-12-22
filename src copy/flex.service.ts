import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FlexService {
private readonly logger = new Logger(FlexService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
}
