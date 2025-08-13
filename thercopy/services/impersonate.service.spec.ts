import { Test, TestingModule } from "@nestjs/testing";
import { ImpersonateService } from "./impersonate.service";
import { ConfigService } from "@nestjs/config";

describe("ImpersonateService", () => {
  let service: ImpersonateService;
  let configService: ConfigService;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        ImpersonateService,
      ],
    }).compile();

    service = module.get<ImpersonateService>(ImpersonateService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getRedirectUrl", () => {
    it("return correct redirect URL", () => {
      const kcClientId = "my-client";
      const ref = "user123";
      const refType = "user";
      const sessionId = "abc-123";

      const mockConfig = {
        callbackUrl: {
          host: "http://localhost:4011",
          loginPath: "/login",
          loginQueryParam: "id",
        },
      };

      (configService.get as jest.Mock).mockReturnValue(mockConfig);
      const result = service.getRedirectUrl(
        kcClientId,
        ref,
        refType,
        sessionId
      );

      expect(result).toBe(
        "http://localhost:4011/login?id=abc-123&ref=user123&refType=user&role=act-as-customer"
      );
    });
  });
});
