import { Test, TestingModule } from "@nestjs/testing";
import { ViljaApplicationService } from "./vilja-application.service";
import { ViljaPlatformRequestsService } from "./vilja-platform-requests.service";

describe("CreateApplicationService", () => {
  let service: ViljaApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ViljaPlatformRequestsService,
          useValue: {
            getRequestConfig: jest.fn(),
            sendRequestToVp: jest.fn(),
            sendSmeRequestToVP: jest.fn(),
          },
        },
        ViljaApplicationService,
      ],
    }).compile();

    service = module.get<ViljaApplicationService>(ViljaApplicationService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
