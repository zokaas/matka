import { Test, TestingModule } from "@nestjs/testing";
import { ApplicationHandlingService } from "./application-handling.service";
import { HandleApplicationsInRedisService } from "./handle-applications-in-redis.service";
import {
  ViljaApplicationService,
  ViljaPlatformService,
} from "@opr-finance/vilja-platform";
import { AdminSessionService } from "@opr-finance/authentication";
import { KeycloakApplicationHandlingService } from "./keycloak-application-handling.service";
import { ErrorHandlingService } from "./error-handling.service";
import { HandleNewApplicationService } from "./handle-new-application.service";

describe("ApplicationHandlingService", () => {
  let service: ApplicationHandlingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: HandleApplicationsInRedisService,
          useValue: {
            moveApplicationIdToRejected: jest.fn(),
            moveApplicationIdToViljaDone: jest.fn(),
            moveApplicationIdToDone: jest.fn(),
          },
        },
        {
          provide: ViljaPlatformService,
          useValue: {
            getDataFromVp: jest.fn(),
          },
        },
        {
          provide: ViljaApplicationService,
          useValue: {
            addRoleToCompany: jest.fn(),
          },
        },
        {
          provide: AdminSessionService,
          useValue: {
            returnAdminSession: jest.fn(),
          },
        },
        {
          provide: KeycloakApplicationHandlingService,
          useValue: {
            createProfileInKeycloak: jest.fn(),
            sendWelcomeEmail: jest.fn(),
          },
        },
        {
          provide: ErrorHandlingService,
          useValue: {
            handleViljaError: jest.fn(),
          },
        },
        {
          provide: HandleNewApplicationService,
          useValue: {
            handleNewApplication: jest.fn(),
          },
        },
        ApplicationHandlingService,
      ],
    }).compile();

    service = module.get<ApplicationHandlingService>(
      ApplicationHandlingService
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
