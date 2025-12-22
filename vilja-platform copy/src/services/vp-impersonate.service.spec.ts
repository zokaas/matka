import { Test, TestingModule } from "@nestjs/testing";
import { VpImpersonateService } from "./vp-impersonate.service";
import { ViljaPlatformRequestsService } from "./vilja-platform-requests.service";

describe("VpImpersonateService", () => {
  let service: VpImpersonateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ViljaPlatformRequestsService,
          useValue: {
            useValue: {
              getRequestConfig: jest.fn(),
              sendRequestToVp: jest.fn(),
            },
          },
        },
        VpImpersonateService,
      ],
    }).compile();

    service = module.get<VpImpersonateService>(VpImpersonateService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
