import { Test, TestingModule } from "@nestjs/testing";
import { ErrorHandlingService } from "./error-handling.service";
import { TeamsMessagingService } from "@opr-finance/teams-messaging";

describe("ErrorHandlingService", () => {
  let service: ErrorHandlingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TeamsMessagingService,
          useValue: {
            createGeneralErrorTeamsCard: jest.fn(),
            createViljaErrorTeamsCard: jest.fn(),
            createKeycloakErrorTeamsCard: jest.fn(),
            sendTeamsMessage: jest.fn(),
          },
        },
        ErrorHandlingService,
      ],
    }).compile();

    service = module.get<ErrorHandlingService>(ErrorHandlingService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
