import { Test, TestingModule } from "@nestjs/testing";
import { KycController } from "./kyc.controller";
import { KycService } from "./kyc.service";
import { LoggerService } from "@opr-finance/logger";
import { KycResponseTransformInterceptor } from "./interceptors";

describe("KycController", () => {
  let controller: KycController;
  let kycService: jest.Mocked<KycService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KycController],
      providers: [
        {
          provide: KycService,
          useValue: {
            getProductData: jest.fn(),
            getCountryList: jest.fn(),
            sendFormData: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            logDebug: jest.fn(),
            logError: jest.fn(),
          },
        },
      ],
    })
      .overrideInterceptor(KycResponseTransformInterceptor)
      .useValue({
        intercept: jest.fn((_, next) => next.handle()),
      })
      .compile();

    controller = module.get<KycController>(KycController);
    kycService = module.get(KycService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return product data", async () => {
    const mockData = { form: [] };
    kycService.getProductData.mockResolvedValue(mockData as any);

    const result = await controller.getProductData("client1", "business");

    expect(kycService.getProductData).toHaveBeenCalledWith(
      "client1",
      "business"
    );
    expect(result).toEqual(mockData);
  });

  it("should submit form answers", async () => {
    const payload: any = {
      organizationNumber: "123",
      userId: "user1",
    };

    kycService.sendFormData.mockResolvedValue({ success: true });

    const result = await controller.sendFormAnswers(
      "client1",
      "business",
      "app1",
      payload
    );

    expect(kycService.sendFormData).toHaveBeenCalledWith(payload, "answers");
    expect(result).toEqual({ success: true });
  });
});
