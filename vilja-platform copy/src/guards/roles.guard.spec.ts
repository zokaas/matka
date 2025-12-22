import { RolesGuard } from "./roles.guard";

describe("RolesGuard", () => {
  it("should be defined", () => {
    //expect(new RolesGuard()).toBeDefined();
  });
});

/* EXAMPLE

import { Test } from '@nestjs/testing';
import { MyGuard } from './my.guard';
import { ExecutionContext } from '@nestjs/common';

describe('MyGuard', () => {
  let guard: MyGuard;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [MyGuard],
    }).compile();

    guard = moduleRef.get<MyGuard>(MyGuard);
  });

  it('should deny access', () => {
    const executionContext = {
      switchToHttp: () => ({
        getRequest: () => ({ user: null }),
      }),
    } as any as ExecutionContext;

    expect(guard.canActivate(executionContext)).toBe(false);
  });

  it('should grant access', () => {
    const executionContext = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { id: 1 } }),
      }),
    } as any as ExecutionContext;

    expect(guard.canActivate(executionContext)).toBe(true);
  });
});

 */
