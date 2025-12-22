import { Test, TestingModule } from "@nestjs/testing";
import { TransactionsService } from "./transactions.service";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { LoggerService } from "@opr-finance/logger";

describe("TransactionsService", () => {
  let service: TransactionsService;

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
        TransactionsService,
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
