import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import {
  SessionDto,
  TokenSetDto,
  UserAttributesDto,
  UserInfoDto,
  UserIntrospectDto,
} from "@opr-finance/authentication/dtos/session";
import { InjectRedis } from "@songkeys/nestjs-redis";
import { v4 as uuidv4 } from "uuid";
import { Redis } from "ioredis";

@Injectable()
export class ApiAuthSessionService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  private getReference(profileAttributes: UserAttributesDto) {
    if (profileAttributes.reference) return profileAttributes.reference;

    if (profileAttributes.ssn) return profileAttributes.ssn;

    throw new HttpException(
      "No user reference, check user data in authorisation platform",
      HttpStatus.BAD_REQUEST
    );
  }

  private getSessionKey(uuid: string): string {
    return `session:${uuid}`;
  }

  private getAdminSessionKey(uuid: string): string {
    return `admin-session:${uuid}`;
  }

  private async getSessionDataFromRedis(
    uuid: string
  ): Promise<SessionDto | null> {
    const key = this.getSessionKey(uuid);
    const userData = await this.redis.get(key);
    if (!userData) return null;

    const parsedUserdata: SessionDto = JSON.parse(userData);
    return parsedUserdata;
  }

  getHello(): { status: string } {
    return {
      status: "Never gonna give you up, never gonna let you down",
    };
  }

  async saveAdminSessionToRedis(
    adminUserData: TokenSetDto,
    adminSessionId: string
  ) {
    try {
      const key = this.getAdminSessionKey(adminSessionId);
      await this.redis.set(key, JSON.stringify(adminUserData));
      await this.redis.expire(key, adminUserData.expires_in);
      return adminUserData;
    } catch (error) {
      // TODO: Implement Datadog logger next
      console.log(error);
      throw new HttpException(
        "Unable to store data to memory",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  // TODO: savesessionToRedis and saveCsrSessionToRedis Abstraction?
  async saveSessionToRedis(userData: SessionDto, sessionId?: string | null) {
    const uuid = sessionId || uuidv4();

    try {
      const {
        userInfo: { attrs },
        userIntrospect: { exp },
        tokenSet,
      } = userData;

      const currentTime = Math.floor(Date.now() / 1000); // Current UNIX timestamp
      const expires_in = exp - currentTime;

      const ref: string = this.getReference(attrs);

      // Is there a way to simplify this?
      const sessionData: SessionDto = {
        ...userData,
        tokenSet: {
          ...tokenSet,
          expires_in,
        },
        userInfo: {
          ...userData.userInfo,
          attrs: {
            ...userData.userInfo.attrs,
            ref,
          },
        },
        userIntrospect: {
          ...userData.userIntrospect,
          attrs: {
            ...userData.userIntrospect.attrs,
            ref,
          },
        },
      };

      const key = this.getSessionKey(uuid);
      await this.redis.set(key, JSON.stringify(sessionData));
      await this.redis.expire(key, expires_in);
      return uuid;
    } catch (error) {
      // TODO: Implement Datadog logger next
      console.log(error);
      console.log(error instanceof HttpException);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Unable to store data to memory",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllSessionData(uuid: string): Promise<SessionDto | null> {
    const sessionData = await this.getSessionDataFromRedis(uuid);

    return sessionData;
  }

  async getUserInfoFromSession(uuid: string): Promise<UserInfoDto | null> {
    const sessionData = await this.getSessionDataFromRedis(uuid);

    if (!sessionData) return null;

    return sessionData.userInfo;
  }

  async getIntrospectFromSession(
    uuid: string
  ): Promise<UserIntrospectDto | null> {
    const sessionData = await this.getSessionDataFromRedis(uuid);

    if (!sessionData) return null;

    return sessionData.userIntrospect;
  }

  async getAccessTokenFromSession(uuid: string): Promise<string | null> {
    const sessionData = await this.getSessionDataFromRedis(uuid);

    if (!sessionData) return null;

    const { tokenSet } = sessionData;

    return tokenSet.access_token;
  }

  async getIdTokenFromSession(uuid: string): Promise<string | null> {
    const sessionData = await this.getSessionDataFromRedis(uuid);

    if (!sessionData) return null;

    const { tokenSet } = sessionData;

    return tokenSet.id_token;
  }

  async getRefreshTokenFromSession(uuid: string): Promise<string | null> {
    const sessionData = await this.getSessionDataFromRedis(uuid);

    if (!sessionData) return null;

    const { tokenSet } = sessionData;

    return tokenSet.refresh_token;
  }

  async getSessionRefreshCountFromSession(
    uuid: string
  ): Promise<number | null> {
    const sessionData = await this.getSessionDataFromRedis(uuid);

    if (!sessionData) return null;

    const { sessionConfig } = sessionData;

    return sessionConfig.sessionRefreshCount;
  }

  async destroyUserSession(uuid: string): Promise<number> {
    const key = this.getSessionKey(uuid);
    const result = await this.redis.del(key);

    return result;
  }
}
