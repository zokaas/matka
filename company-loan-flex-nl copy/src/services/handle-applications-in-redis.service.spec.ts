import { Test, TestingModule } from "@nestjs/testing";
import { HandleApplicationsInRedisService } from "./handle-applications-in-redis.service";
import { getRedisToken } from "@songkeys/nestjs-redis";

describe("HandleApplicationsFromRedisService", () => {
  let service: HandleApplicationsInRedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRedisToken("default"),
          useValue: {
            setnx: jest.fn(),
            expire: jest.fn(),
            smembers: jest.fn(),
            smove: jest.fn(),
          },
        },
        HandleApplicationsInRedisService,
      ],
    }).compile();

    service = module.get<HandleApplicationsInRedisService>(
      HandleApplicationsInRedisService
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
