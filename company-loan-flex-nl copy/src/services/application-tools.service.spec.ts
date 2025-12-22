import { Test, TestingModule } from "@nestjs/testing";
import { ApplicationToolsService } from "./application-tools.service";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { LoggerService } from "@opr-finance/logger";

describe("ApplicationToolsService", () => {
  let service: ApplicationToolsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {},
        },
        {
          provide: LoggerService,
          useValue: {},
        },
        ApplicationToolsService,
      ],
    }).compile();

    service = module.get<ApplicationToolsService>(ApplicationToolsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
