import { Test, TestingModule } from "@nestjs/testing";
import { ViljaPlatformService } from "./vilja-platform.service";
import { HttpService } from "@nestjs/axios";
import { LoggerService } from "@opr-finance/logger";
import { ViljaPlatformRequestsService } from "./vilja-platform-requests.service";

describe("ViljaPlatformService", () => {
  let service: ViljaPlatformService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: HttpService,
          useValue: {
            request: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            logError: jest.fn(),
          },
        },
        {
          provide: ViljaPlatformRequestsService,
          useValue: {
            getRequestConfig: jest.fn(),
            sendRequestToVp: jest.fn(),
          },
        },
        ViljaPlatformService,
      ],
    }).compile();

    service = module.get<ViljaPlatformService>(ViljaPlatformService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
