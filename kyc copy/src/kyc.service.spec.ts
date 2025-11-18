import { Test, TestingModule } from "@nestjs/testing";
import { KycService } from "./kyc.service";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { KycFormParser } from "./utils";


describe("KycService", () => {
  let service: KycService;

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
          provide: KycFormParser,
          useValue: {
            parseProductData: jest.fn(),
            parseCountryList: jest.fn(),
          },
        },
        KycService,
      ],
    }).compile();

    service = module.get<KycService>(KycService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
