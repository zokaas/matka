import { Test, TestingModule } from '@nestjs/testing';
import { FlexService } from './flex.service';

describe('FlexService', () => {
  let service: FlexService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlexService],
    }).compile();

    service = module.get<FlexService>(FlexService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
