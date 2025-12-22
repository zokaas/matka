import { Test, TestingModule } from "@nestjs/testing";
import { LfpUsersService } from "./lfp-users.service";
import { ConfigService } from "@nestjs/config";
import { ViljaApplicationService } from "./vilja-application.service";

describe("LfpUsersService", () => {
  let service: LfpUsersService;

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
          provide: ViljaApplicationService,
          useValue: {
            addRoleToCompany: jest.fn(),
          },
        },
        LfpUsersService,
      ],
    }).compile();

    service = module.get<LfpUsersService>(LfpUsersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
