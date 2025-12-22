import { Test, TestingModule } from '@nestjs/testing';
import { FlexController } from './flex.controller';

describe('FlexController', () => {
  let controller: FlexController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlexController],
    }).compile();

    controller = module.get<FlexController>(FlexController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
