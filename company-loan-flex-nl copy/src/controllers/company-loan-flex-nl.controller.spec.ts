import { Test, TestingModule } from "@nestjs/testing";
import { CompanyLoanFlexNlController } from "./company-loan-flex-nl.controller";
import {
  ApplicationHandlingService,
  ApplicationToolsService,
  KeycloakApplicationHandlingService,
} from "../services";

describe("CompanyLoanFlexNlController", () => {
  let controller: CompanyLoanFlexNlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyLoanFlexNlController],
      providers: [
        {
          provide: KeycloakApplicationHandlingService,
          useValue: {
            checkUser: jest.fn(),
          },
        },
        {
          provide: ApplicationHandlingService,
          useValue: {
            newApplication: jest.fn(),
          },
        },
        {
          provide: ApplicationToolsService,
          useValue: {
            getCompaniesList: jest.fn(),
            getCompanyBasicInfo: jest.fn(),
            getStreet: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CompanyLoanFlexNlController>(
      CompanyLoanFlexNlController
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
