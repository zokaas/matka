import { Test, TestingModule } from "@nestjs/testing";
import { StrapiController } from "./strapi.controller";
import { StrapiService } from "./strapi.service";

describe("StrapiController", () => {
  let controller: StrapiController;
  let strapiService: StrapiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StrapiController],
      providers: [
        {
          provide: StrapiService,
          useValue: {
            getTranslations: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StrapiController>(StrapiController);
    strapiService = module.get<StrapiService>(StrapiService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
  it("should call strapiService.getTranslations and return the result", async () => {
    const mockResult = { key: "value" };
    const contentType = "application/json";
    const product = "flex";
    const type = "application";
    const lang = "en";

    (strapiService.getTranslations as jest.Mock).mockResolvedValue(mockResult);

    const result = await controller.getTranslations(
      contentType,
      product,
      type,
      lang
    );

    expect(strapiService.getTranslations).toHaveBeenCalledWith(
      contentType,
      product,
      type,
      lang
    );
    expect(result).toEqual(mockResult);
  });
});
