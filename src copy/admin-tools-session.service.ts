import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRedis } from "@songkeys/nestjs-redis";
import { Redis } from "ioredis";
import { TokenSetDto } from "@opr-finance/authentication/dtos";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class AdminToolsSessionService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  private getRedisKey(sessionId: string): string {
    return `admin-tools-session:${sessionId}`;
  }

  async saveAdminSessionToRedis(
    tokenSet: TokenSetDto,
    sessionId?: string
  ): Promise<string> {
    const id = sessionId || uuidv4();
    const key = this.getRedisKey(id);

    try {
      await this.redis.set(key, JSON.stringify(tokenSet));
      await this.redis.expire(key, tokenSet.expires_in);
      return id;
    } catch (error) {
      throw new HttpException(
        "Unable to store data to memory",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAdminSessionFromRedis(sessionId: string): Promise<TokenSetDto | null> {
    const key = this.getRedisKey(sessionId);
    const raw = await this.redis.get(key);
    return raw ? JSON.parse(raw) : null;
  }

  async destroyAdminSession(sessionId: string): Promise<number> {
    const key = this.getRedisKey(sessionId);
    return this.redis.del(key);
  }
}
