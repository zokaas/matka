import { Test, TestingModule } from "@nestjs/testing";
import { ImpersonateController } from "./impersonate.controller";
import { ImpersonateService } from "../services";
import { IImpersonateRequestQuery } from "../interfaces";

describe("ImpersonateController", () => {
  let controller: ImpersonateController;
  let impersonateService: jest.Mocked<ImpersonateService>;

  beforeEach(async () => {
    const mockService: Partial<jest.Mocked<ImpersonateService>> = {
      getRedirectUrl: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImpersonateController],
      providers: [
        {
          provide: ImpersonateService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ImpersonateController>(ImpersonateController);
    impersonateService = module.get(ImpersonateService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
  describe("impersonateLogin", () => {
    it("should return a redirect URL", () => {
      const kcClientId = "client123";
      const sessionId = "Bearer token";
      const userToImpersonate: IImpersonateRequestQuery = {
        ref: "user-id-123",
        refType: "internal",
      };

      const expectedUrl = "https://example.com/redirect";
      impersonateService.getRedirectUrl.mockReturnValue(expectedUrl);

      const result = controller.impersonateLogin(
        userToImpersonate,
        kcClientId,
        sessionId
      );

      expect(impersonateService.getRedirectUrl).toHaveBeenCalledWith(
        kcClientId,
        userToImpersonate.ref,
        userToImpersonate.refType,
        sessionId
      );
      expect(result).toEqual({ url: expectedUrl });
    });
  });
});
