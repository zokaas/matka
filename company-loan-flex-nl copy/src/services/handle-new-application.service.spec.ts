import { Test, TestingModule } from "@nestjs/testing";
import { HandleNewApplicationService } from "./handle-new-application.service";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { LoggerService } from "@opr-finance/logger";
import { ViljaApplicationService } from "@opr-finance/vilja-platform";
import { StrapiService } from "@opr-finance/strapi";

describe("HandleNewApplicationService", () => {
  let service: HandleNewApplicationService;

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
        {
          provide: ViljaApplicationService,
          useValue: {
            createCompany: jest.fn(),
            createApplication: jest.fn(),
          },
        },
        {
          provide: StrapiService,
          useValue: {
            getTranslations: jest.fn(),
          },
        },
        HandleNewApplicationService,
      ],
    }).compile();

    service = module.get<HandleNewApplicationService>(
      HandleNewApplicationService
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
