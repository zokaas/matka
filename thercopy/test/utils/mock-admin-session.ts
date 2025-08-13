import { TokenSetDto } from "@opr-finance/authentication/dtos";
import { AdminSessionService } from "@opr-finance/authentication/services";

export class TestableAdminSessionService extends AdminSessionService {
  public override makeRequest = super.makeRequest;
}

export class MockAdminSessionService extends AdminSessionService {
  override returnAdminSession = jest.fn<Promise<TokenSetDto>, [string]>();
}
