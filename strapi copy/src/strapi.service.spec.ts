import { Test, TestingModule } from "@nestjs/testing";
import { StrapiService } from "./strapi.service";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { LoggerService } from "@opr-finance/logger";
import { AxiosHeaders, AxiosResponse } from "axios";
import { of, throwError } from "rxjs";
import { getRedisToken } from "@songkeys/nestjs-redis";

describe("StrapiService", () => {
  let service: StrapiService;
  let httpService: HttpService;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case "strapi.baseUrl":
                  return "http://mock-strapi";
                case "strapi.token":
                  return "mock-token";
                default:
                  return null;
              }
            }),
          },
        },
        {
          provide: HttpService,
          useValue: {
            request: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            logError: jest.fn(),
          },
        },
        {
          provide: getRedisToken("default"),
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        StrapiService,
      ],
    }).compile();

    service = module.get<StrapiService>(StrapiService);
    httpService = module.get<HttpService>(HttpService);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
  it("should return translation data for global type", async () => {
    const mockResponse: AxiosResponse = {
      data: { message: "success" },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        headers: new AxiosHeaders({
          Authorization: "Bearer mock-token",
          "Content-Type": "application/json",
        }),
        url: "http://mock-strapi/api/global?populate=all&locale=en",
        method: "GET",
      },
    };

    (httpService.request as jest.Mock).mockReturnValue(of(mockResponse));

    const result = await service.getTranslations(
      "application/json",
      "someProduct",
      "global",
      "en"
    );

    expect(result).toEqual({ message: "success" });

    const [reqConfig] = (httpService.request as jest.Mock).mock.calls[0];

    const url = new URL(reqConfig.url);

    expect(reqConfig.method).toBe("GET");
    expect(url.origin + url.pathname).toBe("http://mock-strapi/api/global");
    expect(url.searchParams.get("locale")).toBe("en");
    expect(url.searchParams.get("populate")).toBe("all");
    expect(reqConfig.headers).toEqual(
      expect.objectContaining({
        Authorization: "Bearer mock-token",
        "Content-Type": "application/json",
      })
    );
  });

  it("should return translation data for product-specific type", async () => {
    const mockResponse: AxiosResponse = {
      data: { message: "product-specific" },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        headers: new AxiosHeaders({
          Authorization: "Bearer mock-token",
          "Content-Type": "application/json",
        }),
        url: "http://mock-strapi/api/flex-application?populate=all&locale=nl",
        method: "GET",
      },
    };

    (httpService.request as jest.Mock).mockReturnValue(of(mockResponse));

    const result = await service.getTranslations(
      "application/json",
      "flex",
      "application",
      "nl"
    );

    expect(result).toEqual({ message: "product-specific" });

    const [reqConfig] = (httpService.request as jest.Mock).mock.calls[0];

    const url = new URL(reqConfig.url);

    expect(reqConfig.method).toBe("GET");
    expect(url.origin + url.pathname).toBe(
      "http://mock-strapi/api/flex-application"
    );
    expect(url.searchParams.get("locale")).toBe("nl");
    expect(url.searchParams.get("populate")).toBe("all");
    expect(reqConfig.headers).toEqual(
      expect.objectContaining({
        Authorization: "Bearer mock-token",
        "Content-Type": "application/json",
      })
    );
  });

  it("should log and throw error on failed request", async () => {
    const error = {
      response: {
        status: 404,
        data: "Not Found",
      },
    };

    (httpService.request as jest.Mock).mockReturnValue(throwError(() => error));

    await expect(
      service.getTranslations("application/json", "flex", "application", "nl")
    ).rejects.toThrow("Not Found");

    expect(loggerService.logError).toHaveBeenCalledWith(
      expect.stringContaining("strapi.service"),
      expect.objectContaining({
        response: {
          statusCode: 404,
          data: "Not Found",
        },
      })
    );
  });

  it("should handle errors with no response object", async () => {
    const error = new Error("Network error");
    (httpService.request as jest.Mock).mockReturnValue(throwError(() => error));

    await expect(
      service.getTranslations("application/json", "flex", "application", "nl")
    ).rejects.toThrow("empty");

    expect(loggerService.logError).toHaveBeenCalledWith(
      expect.stringContaining("strapi.service"),
      expect.objectContaining({
        response: {
          statusCode: 500,
          data: "empty",
        },
      })
    );
  });
});
