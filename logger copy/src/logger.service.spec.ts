import { Test, TestingModule } from "@nestjs/testing";
import { LoggerService } from "./logger.service";
import { ConfigService } from "@nestjs/config";

describe("LoggerService", () => {
  let service: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        LoggerService,
      ],
    }).compile();

    service = module.get<LoggerService>(LoggerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
