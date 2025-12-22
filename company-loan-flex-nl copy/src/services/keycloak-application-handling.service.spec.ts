import { Test, TestingModule } from "@nestjs/testing";
import { KeycloakApplicationHandlingService } from "./keycloak-application-handling.service";
import { KeycloakService } from "@opr-finance/keycloak";
import { ErrorHandlingService } from "./error-handling.service";

describe("KeycloakApplicationHandlingService", () => {
  let service: KeycloakApplicationHandlingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: KeycloakService,
          useValue: {
            createUser: jest.fn(),
            sendWelcomeEmailbyUserId: jest.fn(),
            isExistingUser: jest.fn(),
          },
        },
        {
          provide: ErrorHandlingService,
          useValue: {
            handleKeycloakError: jest.fn(),
          },
        },
        KeycloakApplicationHandlingService,
      ],
    }).compile();

    service = module.get<KeycloakApplicationHandlingService>(
      KeycloakApplicationHandlingService
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
