import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AppRepository } from "./app.repository";
import { ContentfulService } from "./contentful/contentful.service";

describe("AppController", () => {
    let appController: AppController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [
                AppService,
                {
                    provide: AppRepository,
                    useValue: {},
                },
                {
                    provide: ContentfulService,
                    useValue: {},
                },
            ],
        }).compile();

        appController = app.get<AppController>(AppController);
    });

    describe("root", () => {
        it('should return "Rick Roll!"', () => {
            expect(appController.getHello().status).toBe(
                "Never gonna give you up, never gonna let you down"
            );
        });
    });
});
