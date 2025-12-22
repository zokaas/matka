import { Test, TestingModule } from "@nestjs/testing";
import { VpImpersonateController } from "./impersonate.controller";
import { VpImpersonateService } from "../services";

describe("ImpersonateController", () => {
  let controller: VpImpersonateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VpImpersonateController],
      providers: [
        {
          provide: VpImpersonateService,
          useValue: {
            getImpersonatedCustomerEngagementsFromVp: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VpImpersonateController>(VpImpersonateController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
