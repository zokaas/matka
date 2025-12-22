import { Test, TestingModule } from "@nestjs/testing";
import { CompanyLoanFlexNlService } from "./company-loan-flex-nl.service";
import { HandleApplicationsInRedisService } from "./handle-applications-in-redis.service";
import { ApplicationHandlingService } from "./application-handling.service";
import { ErrorHandlingService } from "./error-handling.service";

describe("CompanyLoanFlexNlService", () => {
  let service: CompanyLoanFlexNlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: HandleApplicationsInRedisService,
          useValue: {
            getApplicationListObject: jest.fn(),
          },
        },
        {
          provide: ApplicationHandlingService,
          useValue: {
            getApplicationAndState: jest.fn(),
            applicationRejected: jest.fn(),
            applicationAccepted: jest.fn(),
          },
        },
        {
          provide: ErrorHandlingService,
          useValue: {
            handleGeneralError: jest.fn(),
          },
        },
        CompanyLoanFlexNlService,
      ],
    }).compile();

    service = module.get<CompanyLoanFlexNlService>(CompanyLoanFlexNlService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
